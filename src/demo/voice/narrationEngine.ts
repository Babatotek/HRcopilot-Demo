// ============================================
// FILE: src/demo/voice/narrationEngine.ts
// PURPOSE: 3-layer narration engine (Kokoro removed)
//
//   Layer 1 — ElevenLabs (if configured)
//   Layer 2 — Groq TTS   (if configured)
//   Layer 3 — Cinematic subtitles only (always works)
//
//   Fallback order: primary provider → other provider → subtitles
//
// IMPORTANT — NO STATIC STORE IMPORTS:
//   Both useNarratorStore and useDemoOrchestrator are accessed via lazy
//   dynamic imports to prevent Rollup TDZ in production builds.
//   The circular chain is:
//     narrationEngine → narratorStore (const TDZ)
//     narrationEngine → demoOrchestrator (const TDZ)
//   Both are broken by deferring to dynamic import().
// ============================================

import { subtitleEngine } from './subtitleEngine';
import { withGroqKey } from '../../lib/groqKeyPool';
import { withElevenLabsKey } from '../../lib/elevenLabsKeyPool';
import { cacheBlobAudio, getCachedBlobAudio } from './audioCache';
import type { NarratorProvider, SpeakOptions, NarratorTestResult } from './types';

// ── Lazy store accessors — NO static imports of Zustand stores ────────────────
// Accessing useNarratorStore or useDemoOrchestrator statically here creates
// a Rollup TDZ because this module is in the same chunk as the store modules
// and Rollup can't guarantee initialization order in circular graphs.

type NarratorStoreApi = {
  getState: () => {
    provider: string; volume: number; muted: boolean;
    ambienceEnabled: boolean; ambienceVolume: number; ambienceUrl: string;
    elevenLabsVoiceId: string; elevenLabsModel: string;
    groqVoice: string;
    setStatus: (s: string) => void;
    setCurrentText: (t: string) => void;
    setCurrentWord: (w: string, i: number) => void;
    setError: (e: string | null) => void;
  };
  subscribe: (cb: (state: any, prev: any) => void) => void;
};

let _narratorStore: NarratorStoreApi | null = null;

function _store(): NarratorStoreApi['getState'] extends () => infer R ? R : never {
  if (!_narratorStore) {
    // Fallback no-op store — used only if called before dynamic import resolves
    // (practically impossible since speak() requires a user gesture first)
    return {
      provider: 'groq', volume: 0.8, muted: false,
      ambienceEnabled: false, ambienceVolume: 0.3, ambienceUrl: '',
      elevenLabsVoiceId: '', elevenLabsModel: 'eleven_turbo_v2_5',
      groqVoice: 'autumn',
      setStatus: () => {}, setCurrentText: () => {},
      setCurrentWord: () => {}, setError: () => {},
    } as any;
  }
  return _narratorStore.getState() as any;
}

// Kick off the lazy load immediately — resolves async, no TDZ risk
import('./narratorStore').then(({ useNarratorStore }) => {
  _narratorStore = useNarratorStore as any;
  // Wire the store subscription now that the module is loaded
  useNarratorStore.subscribe((state: any, prevState: any) => {
    const volumeChanged  = state.ambienceVolume  !== prevState.ambienceVolume;
    const mutedChanged   = state.muted           !== prevState.muted;
    const enabledChanged = state.ambienceEnabled !== prevState.ambienceEnabled;
    const urlChanged     = state.ambienceUrl     !== prevState.ambienceUrl;

    if (!volumeChanged && !mutedChanged && !enabledChanged && !urlChanged) return;

    if (!state.ambienceEnabled || state.muted) { stopAmbience(); return; }

    if (_ambientAudio) {
      if (urlChanged) syncAmbience();
      if ((volumeChanged || mutedChanged) && !_isDucked && _fadeRaf === null) {
        _fadeTo(state.ambienceVolume, 300);
      }
    }
  });
}).catch(() => { /* non-fatal */ });

// ── Lazy orchestrator accessor ────────────────────────────────────────────────
let _getOrchestratorState: (() => { status: string }) | null = null;
let _subscribeOrchestrator: ((cb: (s: { status: string }) => void) => void) | null = null;

import('../orchestrator/demoOrchestrator').then(({ useDemoOrchestrator }) => {
  _getOrchestratorState  = () => useDemoOrchestrator.getState();
  _subscribeOrchestrator = (cb) => useDemoOrchestrator.subscribe(cb);
  _wireOrchestratorSubscription();
}).catch(() => { /* non-fatal */ });

// ── Audio context ──────────────────────────────────────────────────────────────

let _audioCtx: AudioContext | null = null;

if (typeof document !== 'undefined') {
  const resume = () => { if (_audioCtx?.state === 'suspended') _audioCtx.resume().catch(() => {}); };
  document.addEventListener('click',      resume, { passive: true });
  document.addEventListener('touchstart', resume, { passive: true });
  document.addEventListener('keydown',    resume, { passive: true });
}

export function primeAudioContext(): void {
  if (!_audioCtx || _audioCtx.state === 'closed') {
    _audioCtx = new AudioContext({ sampleRate: 24000 });
    (window as any)._audioCtx = _audioCtx;
  }
  if (_audioCtx.state === 'suspended') _audioCtx.resume().catch(() => {});
}

export function ensureAudioContextRunning(): Promise<void> {
  if (!_audioCtx || _audioCtx.state === 'running') return Promise.resolve();
  return _audioCtx.resume().catch(() => {});
}

// ── Active playback tracking ───────────────────────────────────────────────────

let _currentAudio: HTMLAudioElement | null = null;
let _isSpeaking = false;
let _speakToken = 0;
let _currentScriptId: string | null = null;

// ── Background Ambience ────────────────────────────────────────────────────────

let _ambientAudio: HTMLAudioElement | null = null;
let _isDucked        = false;
let _fadeRaf: number | null = null;
let _loadedAmbienceUrl = '';

function _fadeTo(target: number, durationMs = 600): Promise<void> {
  return new Promise((resolve) => {
    if (_fadeRaf !== null) { cancelAnimationFrame(_fadeRaf); _fadeRaf = null; }
    if (!_ambientAudio) { resolve(); return; }

    const audio     = _ambientAudio;
    const start     = audio.volume;
    const startTime = performance.now();

    const step = (now: number) => {
      if (!_ambientAudio || _ambientAudio !== audio) { resolve(); return; }
      const t      = Math.min((now - startTime) / durationMs, 1);
      const eased  = 1 - Math.pow(1 - t, 3);
      audio.volume = Math.max(0, Math.min(1, start + (target - start) * eased));
      if (t < 1) {
        _fadeRaf = requestAnimationFrame(step);
      } else {
        audio.volume = target;
        _fadeRaf = null;
        resolve();
      }
    };

    _fadeRaf = requestAnimationFrame(step);
  });
}

export function startAmbience(): void {
  const state = _store();
  if (!state.ambienceEnabled || state.muted) return;

  if (!_ambientAudio) {
    _ambientAudio        = new Audio();
    _ambientAudio.loop   = true;
    _ambientAudio.volume = 0;
  }

  if (_loadedAmbienceUrl !== state.ambienceUrl) {
    _loadedAmbienceUrl        = state.ambienceUrl;
    _ambientAudio.src         = state.ambienceUrl;
    _ambientAudio.currentTime = 0;
  }

  _ambientAudio.play().catch(() => {});
  _fadeTo(state.ambienceVolume, 800);
}

export async function pauseAmbience(): Promise<void> {
  if (!_ambientAudio || _ambientAudio.paused) return;
  await _fadeTo(0, 500);
  _ambientAudio?.pause();
}

export function resumeAmbience(): void {
  const state = _store();
  if (!state.ambienceEnabled || state.muted) return;
  if (!_ambientAudio) { startAmbience(); return; }
  _ambientAudio.play().catch(() => {});
  _fadeTo(state.ambienceVolume, 600);
}

export async function stopAmbience(): Promise<void> {
  if (!_ambientAudio) return;
  const audio = _ambientAudio;
  await _fadeTo(0, 400);
  audio.pause();
  audio.src = '';
  if (_ambientAudio === audio) {
    _ambientAudio      = null;
    _loadedAmbienceUrl = '';
  }
  _isDucked = false;
}

export function syncAmbience(): void {
  const state = _store();
  if (!_ambientAudio) return;

  if (!state.ambienceEnabled || state.muted) { stopAmbience(); return; }

  if (_loadedAmbienceUrl !== state.ambienceUrl) {
    _loadedAmbienceUrl        = state.ambienceUrl;
    _ambientAudio.src         = state.ambienceUrl;
    _ambientAudio.currentTime = 0;
    _ambientAudio.play().catch(() => {});
  }

  if (!_isDucked && _fadeRaf === null) {
    _ambientAudio.volume = Math.max(0, Math.min(1, state.ambienceVolume));
  }
}

function setDucking(ducked: boolean): void {
  if (_isDucked === ducked) return;
  _isDucked = ducked;
  if (!_ambientAudio) return;
  const { ambienceVolume } = _store();
  const target = ducked ? ambienceVolume * 0.2 : ambienceVolume;
  _fadeTo(target, ducked ? 400 : 700);
}

function stopActiveAudio(): void {
  try { _currentAudio?.pause(); } catch { /* ignore */ }
  _currentAudio = null;
  _isSpeaking = false;
  if (_isDucked) setDucking(false);
}

// ── Text sanitiser ─────────────────────────────────────────────────────────────

export function sanitise(text: string): string {
  return text
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*?(.+?)\*\*?/g, '$1')
    .replace(/`{1,3}[^`]*`{1,3}/g, '')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

const ORPHEUS_VOICES = ['autumn','diana','hannah','austin','daniel','troy'] as const;
type OrpheusVoice = typeof ORPHEUS_VOICES[number];

function resolveGroqVoice(stored: string): OrpheusVoice {
  return (ORPHEUS_VOICES as readonly string[]).includes(stored)
    ? stored as OrpheusVoice
    : 'autumn';
}

// ── Static file lookup ─────────────────────────────────────────────────────────

async function tryStaticAudio(
  scriptId: string, role: string | null,
  volume: number, muted: boolean, token: number,
): Promise<boolean> {
  const safe = scriptId.replace(/[^a-zA-Z0-9_-]/g, '-');
  const candidates: string[] = [];
  if (role) {
    candidates.push(`/audio/narration/${safe}.${role}.mp3`);
    candidates.push(`/audio/narration/${safe}.${role}.wav`);
  }
  candidates.push(`/audio/narration/${safe}.mp3`);
  candidates.push(`/audio/narration/${safe}.wav`);

  for (const url of candidates) {
    try {
      const res = await fetch(url, { cache: 'no-cache', headers: { Accept: 'audio/mpeg, audio/wav, audio/*' } });
      if (!res.ok) continue;
      const ct = res.headers.get('content-type') ?? '';
      if (!ct.includes('audio') && !ct.includes('octet-stream') && !ct.includes('mpeg')) continue;
      if (token !== _speakToken) return true;
      const blob = await res.blob();
      if (token !== _speakToken) return true;
      await playAudioBlob(blob, volume, muted, token);
      return true;
    } catch { /* try next */ }
  }
  return false;
}

// ── Layer 1: ElevenLabs ────────────────────────────────────────────────────────

async function speakElevenLabs(
  text: string, token: number,
  scriptId: string | null = _currentScriptId,
  role: string | null = null,
): Promise<void> {
  const { volume, muted, elevenLabsVoiceId } = _store();

  if (scriptId) {
    const served = await tryStaticAudio(scriptId, role, volume, muted, token);
    if (served) return;
  }

  if (scriptId) {
    const cached = await getCachedBlobAudio(scriptId, 'elevenlabs', elevenLabsVoiceId || 'default');
    if (cached && token === _speakToken) {
      await playAudioBlob(cached.blob, volume, muted, token);
      return;
    }
  }

  if (token !== _speakToken) return;

  const audioBlob = await withElevenLabsKey(async (entry) => {
    const voiceId = entry.voiceId || _store().elevenLabsVoiceId;
    const model   = entry.model   || _store().elevenLabsModel || 'eleven_turbo_v2_5';
    if (!voiceId) throw Object.assign(new Error('ElevenLabs voice ID not configured'), { status: 0 });
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`, {
      method: 'POST',
      headers: { 'xi-api-key': entry.apiKey, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
      body: JSON.stringify({ text, model_id: model, voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.0, use_speaker_boost: true } }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      const err: any = new Error(`ElevenLabs ${res.status}: ${body || res.statusText}`);
      err.status = res.status;
      throw err;
    }
    return res.blob();
  });

  if (token !== _speakToken) return;

  if (scriptId) {
    const voiceId = _store().elevenLabsVoiceId || 'default';
    cacheBlobAudio(scriptId, 'elevenlabs', voiceId, audioBlob, 'audio/mpeg').catch(() => {});
  }

  await playAudioBlob(audioBlob, volume, muted, token);
}

// ── Layer 2: Groq TTS ──────────────────────────────────────────────────────────

async function speakGroq(
  text: string, token: number,
  scriptId: string | null = _currentScriptId,
  role: string | null = null,
): Promise<void> {
  const { groqVoice, volume, muted } = _store();
  const voice = resolveGroqVoice(groqVoice);

  if (scriptId) {
    const served = await tryStaticAudio(scriptId, role, volume, muted, token);
    if (served) return;
  }

  if (scriptId) {
    const cached = await getCachedBlobAudio(scriptId, 'groq', voice);
    if (cached && token === _speakToken) {
      await playAudioBlob(cached.blob, volume, muted, token);
      return;
    }
  }

  if (token !== _speakToken) return;

  const audioBlob = await withGroqKey(async (key) => {
    const res = await fetch('https://api.groq.com/openai/v1/audio/speech', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'canopylabs/orpheus-v1-english', input: text, voice, response_format: 'wav' }),
    });
    if (!res.ok) {
      const err: any = new Error(`Groq TTS ${res.status}: ${res.statusText}`);
      err.status = res.status;
      throw err;
    }
    return res.blob();
  });

  if (token !== _speakToken) return;

  if (scriptId) {
    cacheBlobAudio(scriptId, 'groq', voice, audioBlob, 'audio/wav').catch(() => {});
  }

  await playAudioBlob(audioBlob, volume, muted, token);
}

// ── Shared audio blob player ───────────────────────────────────────────────────

async function playAudioBlob(blob: Blob, volume: number, muted: boolean, token: number): Promise<void> {
  if (token !== _speakToken) return;

  const url   = URL.createObjectURL(blob);
  const audio = new Audio(url);
  audio.volume = muted ? 0 : Math.max(0, Math.min(1, volume));
  _currentAudio = audio;

  _store().setStatus('speaking');
  setDucking(true);

  try {
    await new Promise<void>((resolve, reject) => {
      audio.onended = () => { URL.revokeObjectURL(url); if (_currentAudio === audio) _currentAudio = null; resolve(); };
      audio.onerror = () => { URL.revokeObjectURL(url); if (_currentAudio === audio) _currentAudio = null; reject(new Error('Audio playback error')); };
      audio.play().catch(reject);
    });
  } finally {
    if (_isDucked) setDucking(false);
  }

  if (token !== _speakToken) return;
}

// ── Layer 3: Subtitles-only ────────────────────────────────────────────────────

async function speakSubtitlesOnly(text: string): Promise<void> {
  const lines   = subtitleEngine.parseToLines(text, 1.0);
  const totalMs = lines.reduce((s, l) => Math.max(s, l.startDelayMs + l.durationMs), 0);
  subtitleEngine.playLines(lines);
  setDucking(true);
  await new Promise<void>((r) => setTimeout(r, totalMs + 120));
  if (_isDucked) setDucking(false);
}

function startSubtitles(text: string, onWord?: (w: string, i: number) => void): void {
  const store = _store();
  subtitleEngine.onWord((word, idx) => {
    store.setCurrentWord(word, idx);
    onWord?.(word, idx);
  });
  subtitleEngine.playLines(subtitleEngine.parseToLines(text, 1.0));
}

// ── Main speak function ────────────────────────────────────────────────────────

export interface SpeakWithIdOptions extends SpeakOptions {
  scriptId?: string;
  role?: string;
}

export async function speak(text: string, opts: SpeakWithIdOptions = {}): Promise<void> {
  const store    = _store();
  const provider = opts.provider ?? store.provider;
  const clean    = sanitise(text);

  if (!clean) return;

  const token = ++_speakToken;
  const capturedScriptId = opts.scriptId ?? null;
  const capturedRole     = opts.role     ?? null;
  _currentScriptId = capturedScriptId;

  stopActiveAudio();
  subtitleEngine.stop();
  primeAudioContext();

  if (token !== _speakToken) return;

  _isSpeaking = true;
  store.setStatus('loading');
  store.setCurrentText(clean);
  store.setError(null);

  startSubtitles(clean, opts.onWord);

  try {
    if (provider === 'elevenlabs') {
      await speakElevenLabs(clean, token, capturedScriptId, capturedRole);
    } else {
      await speakGroq(clean, token, capturedScriptId, capturedRole);
    }

    if (token !== _speakToken) return;
    store.setStatus('idle');
    store.setError(null);
    opts.onDone?.();

  } catch (primaryErr) {
    if (token !== _speakToken) return;

    const primaryMsg = primaryErr instanceof Error ? primaryErr.message : String(primaryErr);
    console.warn(`[NarrationEngine] ${provider} failed: ${primaryMsg}`);

    let recovered = false;
    try {
      if (provider === 'elevenlabs') {
        await speakGroq(clean, token, capturedScriptId, capturedRole);
      } else {
        await speakElevenLabs(clean, token, capturedScriptId, capturedRole);
      }
      if (token === _speakToken) { recovered = true; }
    } catch { /* fall through to subtitles */ }

    if (token !== _speakToken) return;

    if (!recovered) await speakSubtitlesOnly(clean);

    if (token !== _speakToken) return;

    store.setError(recovered ? null : primaryMsg);
    store.setStatus('idle');
    opts.onDone?.();
    opts.onError?.(primaryErr instanceof Error ? primaryErr : new Error(primaryMsg));

  } finally {
    if (token === _speakToken) {
      _isSpeaking = false;
      subtitleEngine.stop();
    }
  }
}

// ── Stop ──────────────────────────────────────────────────────────────────────

export function stop(): void {
  stopActiveAudio();
  subtitleEngine.stop();
  const store = _store();
  store.setStatus('idle');
  store.setCurrentText('');
  store.setCurrentWord('', -1);
}

export function isSpeaking(): boolean { return _isSpeaking; }

// ── Provider test ─────────────────────────────────────────────────────────────

export async function testProvider(provider: NarratorProvider): Promise<NarratorTestResult> {
  const t0    = Date.now();
  const token = ++_speakToken;
  _currentScriptId = null;
  try {
    if (provider === 'elevenlabs') await speakElevenLabs('HRcopilot voice system ready.', token, null);
    else                           await speakGroq('HRcopilot voice system ready.', token, null);
    return { provider, success: true,  latencyMs: Date.now() - t0 };
  } catch (err) {
    return { provider, success: false, latencyMs: Date.now() - t0,
      error: err instanceof Error ? err.message : String(err) };
  }
}

// ── Demo lifecycle → ambience wiring ─────────────────────────────────────────

let _prevDemoStatus: string = 'idle';

function _wireOrchestratorSubscription(): void {
  if (!_subscribeOrchestrator || !_getOrchestratorState) return;
  _prevDemoStatus = _getOrchestratorState().status;

  _subscribeOrchestrator((state) => {
    if (state.status === _prevDemoStatus) return;
    const prev = _prevDemoStatus;
    _prevDemoStatus = state.status;

    if (state.status === 'running') {
      if (prev === 'paused') resumeAmbience(); else startAmbience();
    } else if (state.status === 'paused') {
      pauseAmbience(); stop();
    } else {
      stopAmbience(); stop();
    }
  });
}
