// ============================================
// FILE: src/demo/voice/narrationEngine.ts
// PURPOSE: 3-layer narration engine (Kokoro removed)
//
//   Layer 1 — ElevenLabs (if configured)
//   Layer 2 — Groq TTS   (if configured)
//   Layer 3 — Cinematic subtitles only (always works)
//
//   Fallback order: primary provider → other provider → subtitles
// ============================================

import { subtitleEngine } from './subtitleEngine';
import { useNarratorStore } from './narratorStore';
import { withGroqKey } from '../../lib/groqKeyPool';
import { withElevenLabsKey } from '../../lib/elevenLabsKeyPool';
import { cacheBlobAudio, getCachedBlobAudio } from './audioCache';
import type { NarratorProvider, SpeakOptions, NarratorTestResult } from './types';

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
// Monotonically-increasing token — each speak() call gets its own.
// Any async work that sees a stale token knows it has been superseded.
let _speakToken = 0;
// scriptId of the currently-speaking narration (used for cache keying)
let _currentScriptId: string | null = null;

function stopActiveAudio(): void {
  try { _currentAudio?.pause(); } catch { /* ignore */ }
  _currentAudio = null;
  _isSpeaking = false;
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

// ── Valid Orpheus voices ───────────────────────────────────────────────────────

const ORPHEUS_VOICES = ['autumn','diana','hannah','austin','daniel','troy'] as const;
type OrpheusVoice = typeof ORPHEUS_VOICES[number];

function resolveGroqVoice(stored: string): OrpheusVoice {
  return (ORPHEUS_VOICES as readonly string[]).includes(stored)
    ? stored as OrpheusVoice
    : 'autumn';
}

// ── Layer 1: ElevenLabs ────────────────────────────────────────────────────────

async function speakElevenLabs(text: string, token: number, scriptId: string | null = _currentScriptId): Promise<void> {
  const { volume, muted, elevenLabsVoiceId } = useNarratorStore.getState();

  // ── Cache hit ──────────────────────────────────────────────────────────────
  if (scriptId) {
    const cached = await getCachedBlobAudio(scriptId, 'elevenlabs', elevenLabsVoiceId || 'default');
    if (cached && token === _speakToken) {
      console.log(`[NarrationEngine] 🎯 Cache hit: ${scriptId}`);
      await playAudioBlob(cached.blob, volume, muted, token);
      return;
    }
  }

  if (token !== _speakToken) return;

  const audioBlob = await withElevenLabsKey(async (entry) => {
    const voiceId = entry.voiceId || useNarratorStore.getState().elevenLabsVoiceId;
    const model   = entry.model   || useNarratorStore.getState().elevenLabsModel || 'eleven_turbo_v2_5';

    if (!voiceId) throw Object.assign(new Error('ElevenLabs voice ID not configured'), { status: 0 });

    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
      {
        method:  'POST',
        headers: { 'xi-api-key': entry.apiKey, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
        body: JSON.stringify({
          text,
          model_id:       model,
          voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.0, use_speaker_boost: true },
        }),
      },
    );

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      const err: any = new Error(`ElevenLabs ${res.status}: ${body || res.statusText}`);
      err.status = res.status;
      throw err;
    }
    return res.blob();
  });

  if (token !== _speakToken) return; // superseded while fetching

  // ── Cache write ────────────────────────────────────────────────────────────
  if (scriptId) {
    const voiceId = useNarratorStore.getState().elevenLabsVoiceId || 'default';
    cacheBlobAudio(scriptId, 'elevenlabs', voiceId, audioBlob, 'audio/mpeg').catch(() => {});
  }

  await playAudioBlob(audioBlob, volume, muted, token);
}

// ── Layer 2: Groq TTS ──────────────────────────────────────────────────────────

async function speakGroq(text: string, token: number, scriptId: string | null = _currentScriptId): Promise<void> {
  const { groqVoice, volume, muted } = useNarratorStore.getState();
  const voice = resolveGroqVoice(groqVoice);

  // ── Cache hit ──────────────────────────────────────────────────────────────
  if (scriptId) {
    const cached = await getCachedBlobAudio(scriptId, 'groq', voice);
    if (cached && token === _speakToken) {
      console.log(`[NarrationEngine] 🎯 Cache hit: ${scriptId}`);
      await playAudioBlob(cached.blob, volume, muted, token);
      return;
    }
  }

  if (token !== _speakToken) return;

  const audioBlob = await withGroqKey(async (key) => {
    const res = await fetch('https://api.groq.com/openai/v1/audio/speech', {
      method:  'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model:           'canopylabs/orpheus-v1-english',
        input:           text,
        voice,
        response_format: 'wav',
      }),
    });

    if (!res.ok) {
      const err: any = new Error(`Groq TTS ${res.status}: ${res.statusText}`);
      err.status = res.status;
      throw err;
    }
    return res.blob();
  });

  if (token !== _speakToken) return; // superseded while fetching

  // ── Cache write ────────────────────────────────────────────────────────────
  if (scriptId) {
    cacheBlobAudio(scriptId, 'groq', voice, audioBlob, 'audio/wav').catch(() => {});
  }

  await playAudioBlob(audioBlob, volume, muted, token);
}

// ── Shared audio blob player ───────────────────────────────────────────────────

async function playAudioBlob(blob: Blob, volume: number, muted: boolean, token: number): Promise<void> {
  // Bail out if a newer speak() call has already superseded us
  if (token !== _speakToken) return;

  const url   = URL.createObjectURL(blob);
  const audio = new Audio(url);
  audio.volume = muted ? 0 : Math.max(0, Math.min(1, volume));
  _currentAudio = audio;

  useNarratorStore.getState().setStatus('speaking');

  await new Promise<void>((resolve, reject) => {
    audio.onended = () => {
      URL.revokeObjectURL(url);
      if (_currentAudio === audio) _currentAudio = null;
      resolve();
    };
    audio.onerror = () => {
      URL.revokeObjectURL(url);
      if (_currentAudio === audio) _currentAudio = null;
      reject(new Error('Audio playback error'));
    };
    audio.play().catch(reject);
  });

  // If we were superseded mid-playback, treat it as a silent cancellation
  if (token !== _speakToken) return;
}

// ── Layer 3: Subtitles-only ────────────────────────────────────────────────────

async function speakSubtitlesOnly(text: string): Promise<void> {
  const lines   = subtitleEngine.parseToLines(text, 1.0);
  const totalMs = lines.reduce((s, l) => Math.max(s, l.startDelayMs + l.durationMs), 0);
  subtitleEngine.playLines(lines);
  await new Promise<void>((r) => setTimeout(r, totalMs + 120));
}

// ── Subtitle wiring ────────────────────────────────────────────────────────────

function startSubtitles(text: string, onWord?: (w: string, i: number) => void): void {
  const store = useNarratorStore.getState();
  subtitleEngine.onWord((word, idx) => {
    store.setCurrentWord(word, idx);
    onWord?.(word, idx);
  });
  subtitleEngine.playLines(subtitleEngine.parseToLines(text, 1.0));
}

// ── Main speak function ────────────────────────────────────────────────────────

export interface SpeakWithIdOptions extends SpeakOptions {
  scriptId?: string; // kept for API compatibility — no longer used for caching
}

export async function speak(text: string, opts: SpeakWithIdOptions = {}): Promise<void> {
  const store    = useNarratorStore.getState();
  const provider = opts.provider ?? store.provider;
  const clean    = sanitise(text);

  if (!clean) return;

  // Increment token — any in-flight speak() call will see its token is stale
  // and bail out before playing audio, preventing overlapping voices.
  const token = ++_speakToken;
  const capturedScriptId = opts.scriptId ?? null;
  _currentScriptId = capturedScriptId;

  stopActiveAudio();
  subtitleEngine.stop();
  primeAudioContext();

  // Guard: if another speak() already bumped the token past ours, abort.
  if (token !== _speakToken) return;

  _isSpeaking = true;
  store.setStatus('loading');
  store.setCurrentText(clean);
  store.setError(null);

  startSubtitles(clean, opts.onWord);

  try {
    if (provider === 'elevenlabs') {
      await speakElevenLabs(clean, token, capturedScriptId);
    } else {
      await speakGroq(clean, token, capturedScriptId);
    }

    // Only update state if we're still the active speak() call
    if (token !== _speakToken) return;

    store.setStatus('idle');
    store.setError(null);
    opts.onDone?.();

  } catch (primaryErr) {
    if (token !== _speakToken) return; // superseded — don't fire callbacks

    const primaryMsg = primaryErr instanceof Error ? primaryErr.message : String(primaryErr);
    console.warn(`[NarrationEngine] ${provider} failed: ${primaryMsg}`);

    let recovered = false;

    // Try the other provider — pass same scriptId so fallback also caches
    try {
      if (provider === 'elevenlabs') {
        await speakGroq(clean, token, capturedScriptId);
      } else {
        await speakElevenLabs(clean, token, capturedScriptId);
      }
      if (token === _speakToken) {
        recovered = true;
        console.log('[NarrationEngine] ↩ Recovered via fallback provider');
      }
    } catch { /* fall through to subtitles */ }

    if (token !== _speakToken) return; // superseded during fallback

    // Layer 3: subtitles already running — just wait them out
    if (!recovered) {
      console.log('[NarrationEngine] ↩ Subtitles-only fallback');
      await speakSubtitlesOnly(clean);
    }

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
  const store = useNarratorStore.getState();
  store.setStatus('idle');
  store.setCurrentText('');
  store.setCurrentWord('', -1);
}

export function isSpeaking(): boolean { return _isSpeaking; }

// ── Provider test ─────────────────────────────────────────────────────────────

export async function testProvider(provider: NarratorProvider): Promise<NarratorTestResult> {
  const t0    = Date.now();
  const token = ++_speakToken; // claim the token so playback works normally
  _currentScriptId = null;     // no caching for test calls
  try {
    if (provider === 'elevenlabs') await speakElevenLabs('HR360 voice system ready.', token, null);
    else                           await speakGroq('HR360 voice system ready.', token, null);
    return { provider, success: true,  latencyMs: Date.now() - t0 };
  } catch (err) {
    return { provider, success: false, latencyMs: Date.now() - t0,
      error: err instanceof Error ? err.message : String(err) };
  }
}

// ── Stubs kept for import compatibility ───────────────────────────────────────
// Files that import these will compile without changes.

export function loadKokoro(): Promise<boolean>  { return Promise.resolve(false); }
export function isKokoroReady(): boolean        { return false; }
export async function generateKokoroPCM(_text: string): Promise<{ pcm: Float32Array; sampleRate: number }> {
  throw new Error('Kokoro has been removed from the narration system.');
}
