// ============================================
// FILE: src/demo/voice/NarratorInlinePanel.tsx
// PURPOSE: Narrator panel — ElevenLabs + Groq only. Kokoro removed.
// ============================================

import { useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useNarratorStore } from './narratorStore';
import { testProvider, speak, stop, primeAudioContext } from './narrationEngine';
import { GROQ_TTS_VOICES } from './types';
import type { NarratorProvider, NarratorTestResult } from './types';
import { CacheAdminTabDark } from './CacheAdminTabDark';

type MainTab = 'providers' | 'settings' | 'cache';

const PROVIDER_META: Record<NarratorProvider, { label: string; icon: string; color: string; description: string }> = {
  elevenlabs: { label: 'ElevenLabs', icon: '⚡', color: 'from-amber-500 to-orange-600',  description: 'Ultra-realistic neural voice. Requires API key. Best audio quality.' },
  groq:       { label: 'Groq TTS',   icon: '🚀', color: 'from-emerald-500 to-teal-600',  description: 'Orpheus voices via Groq. Requires API key. Very fast, low latency.' },
};

export function NarratorInlinePanel() {
  const store = useNarratorStore();
  const [testResults, setTestResults] = useState<Partial<Record<NarratorProvider, NarratorTestResult>>>({});
  const [testing,     setTesting]     = useState<NarratorProvider | null>(null);
  const [configTab,   setConfigTab]   = useState<NarratorProvider>('elevenlabs');
  const [mainTab,     setMainTab]     = useState<MainTab>('providers');
  const [previewText, setPreviewText] = useState('Welcome to HR360. Your workforce intelligence platform is ready.');

  const handleTest = useCallback(async (p: NarratorProvider) => {
    setTesting(p);
    const result = await testProvider(p);
    setTestResults((prev) => ({ ...prev, [p]: result }));
    setTesting(null);
  }, []);

  const handlePreview = useCallback(() => {
    primeAudioContext();
    if (store.status === 'speaking') { stop(); return; }
    speak(previewText, { provider: configTab }).catch(() => {});
  }, [previewText, configTab, store.status]);

  return (
    <div className="space-y-5">

      {/* Status bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-violet-500/20 text-violet-300 border border-violet-500/30">
          Active: {PROVIDER_META[store.provider]?.label ?? store.provider}
        </span>
        {store.status === 'speaking' && (
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />Speaking…
          </span>
        )}
      </div>

      {/* Main tab bar */}
      <div className="flex gap-1 bg-white/5 rounded-2xl p-1">
        {([
          { id: 'providers', label: '🎙️ Providers'  },
          { id: 'settings',  label: '⚙️ Settings'   },
          { id: 'cache',     label: '💾 Audio Cache' },
        ] as { id: MainTab; label: string }[]).map((t) => (
          <button key={t.id} onClick={() => setMainTab(t.id)}
            className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              mainTab === t.id ? 'bg-violet-600 text-white' : 'text-white/40 hover:text-white/70 hover:bg-white/5'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── PROVIDERS TAB ── */}
      {mainTab === 'providers' && (
        <div className="space-y-5">
          <div>
            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-3">Select Active Provider</p>
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(PROVIDER_META) as NarratorProvider[]).map((p) => {
                const meta     = PROVIDER_META[p];
                const isActive = store.provider === p;
                const result   = testResults[p];
                return (
                  <button key={p} onClick={() => { store.setProvider(p); setConfigTab(p); }}
                    className={`relative p-4 rounded-2xl border-2 text-left transition-all ${
                      isActive ? 'border-violet-500 bg-violet-500/15 shadow-lg shadow-violet-500/10' : 'border-white/10 hover:border-violet-500/40 bg-white/5'
                    }`}>
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${meta.color} flex items-center justify-center text-white text-sm mb-2`}>
                      {meta.icon}
                    </div>
                    <p className="text-[11px] font-black text-white uppercase tracking-tight">{meta.label}</p>
                    <p className="text-[10px] text-white/40 mt-0.5 leading-relaxed">{meta.description}</p>
                    {result && (
                      <div className={`mt-2 flex items-center gap-1.5 text-[9px] font-bold uppercase ${result.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                        <span>{result.success ? '✓' : '✗'}</span>
                        <span>{result.success ? `${result.latencyMs}ms` : result.error?.slice(0, 28)}</span>
                      </div>
                    )}
                    {isActive && <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_6px_rgba(139,92,246,0.8)]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Test buttons */}
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-3">Test Providers</p>
            <div className="flex gap-2 flex-wrap">
              {(Object.keys(PROVIDER_META) as NarratorProvider[]).map((p) => (
                <button key={p} onClick={() => handleTest(p)} disabled={testing !== null}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white/10 text-white/60 hover:bg-white/20 transition-all disabled:opacity-50">
                  {testing === p
                    ? <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                    : testResults[p] ? (testResults[p]!.success ? '✓' : '✗') : '⚡'}
                  Test {PROVIDER_META[p].label}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-3">Voice Preview</p>
            <textarea value={previewText} onChange={(e) => setPreviewText(e.target.value)} rows={2}
              className="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-violet-500/30 resize-none mb-3" />
            <button onClick={handlePreview}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                store.status === 'speaking'
                  ? 'bg-rose-600 hover:bg-rose-500 text-white'
                  : store.status === 'loading'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 cursor-wait'
                    : 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/25'
              }`}>
              {store.status === 'speaking' ? '⏹ Stop' : store.status === 'loading' ? '⏳ Loading…' : `▶ Preview · ${PROVIDER_META[configTab]?.label}`}
            </button>
          </div>
        </div>
      )}

      {/* ── SETTINGS TAB ── */}
      {mainTab === 'settings' && (
        <div className="space-y-5">
          {/* Provider config tabs */}
          <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4">Provider Configuration</p>
            <div className="flex gap-2 mb-5">
              {(Object.keys(PROVIDER_META) as NarratorProvider[]).map((p) => (
                <button key={p} onClick={() => setConfigTab(p)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    configTab === p ? 'bg-violet-600 text-white' : 'bg-white/10 text-white/40 hover:text-white hover:bg-white/15'
                  }`}>
                  {PROVIDER_META[p].icon} {PROVIDER_META[p].label}
                </button>
              ))}
            </div>

            {configTab === 'elevenlabs' && (
              <div className="space-y-4">
                <Field label="API Key" type="password" placeholder="sk_..." value={store.elevenLabsApiKey} onChange={(v) => store.updateConfig({ elevenLabsApiKey: v })} />
                <Field label="Voice ID" placeholder="e.g. Xb7hH8MSUJpSbSDYk0k2" value={store.elevenLabsVoiceId} onChange={(v) => store.updateConfig({ elevenLabsVoiceId: v })} />
                <div>
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-1.5">Model</label>
                  <select value={store.elevenLabsModel} onChange={(e) => store.updateConfig({ elevenLabsModel: e.target.value })}
                    className="w-full bg-[#1a1530] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40">
                    <option value="eleven_turbo_v2_5">Turbo v2.5 — Fastest</option>
                    <option value="eleven_multilingual_v2">Multilingual v2 — Best quality</option>
                    <option value="eleven_monolingual_v1">Monolingual v1 — Legacy</option>
                  </select>
                </div>
                <InfoBox variant="warning">ElevenLabs charges per character. Manage keys in Admin Panel → API Keys.</InfoBox>
              </div>
            )}

            {configTab === 'groq' && (
              <div className="space-y-4">
                <Field label="Groq API Key" type="password" placeholder="gsk_..." value={store.groqApiKey} onChange={(v) => store.updateConfig({ groqApiKey: v })} />
                <p className="text-[9px] text-white/30 -mt-2">Manage multiple keys in Admin Panel → API Keys</p>
                <div>
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-1.5">Voice</label>
                  <select value={store.groqVoice} onChange={(e) => store.updateConfig({ groqVoice: e.target.value })}
                    className="w-full bg-[#1a1530] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40">
                    {GROQ_TTS_VOICES.map((v) => <option key={v.id} value={v.id}>{v.label}</option>)}
                  </select>
                </div>
                <InfoBox>Orpheus v1 English via Groq. Ultra-fast inference, ~100 chars/sec.</InfoBox>
              </div>
            )}
          </div>

          {/* Volume + Subtitles */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">
                Volume — <span className="text-white">{Math.round(store.volume * 100)}%</span>
              </p>
              <input type="range" min="0" max="1" step="0.05" value={store.volume}
                onChange={(e) => store.updateConfig({ volume: parseFloat(e.target.value) })}
                className="w-full accent-violet-500 h-2 mb-4" />
              <button onClick={() => store.updateConfig({ muted: !store.muted })}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-black uppercase transition-all w-full justify-center ${
                  store.muted ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-white/10 text-white/60 border border-white/10'
                }`}>
                {store.muted ? '🔇 Muted' : '🔊 Unmuted'}
              </button>
            </div>

            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Subtitles</p>
              <button onClick={() => store.updateConfig({ subtitlesEnabled: !store.subtitlesEnabled })}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-black uppercase transition-all w-full justify-center mb-3 ${
                  store.subtitlesEnabled ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' : 'bg-white/10 text-white/40 border border-white/10'
                }`}>
                {store.subtitlesEnabled ? '✓ Enabled' : '✗ Disabled'}
              </button>
              <div className="flex gap-2">
                {(['sm', 'md', 'lg'] as const).map((size) => (
                  <button key={size} onClick={() => store.updateConfig({ subtitleFontSize: size })}
                    className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${
                      store.subtitleFontSize === size ? 'bg-violet-600 text-white' : 'bg-white/10 text-white/40'
                    }`}>
                    {size.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button onClick={store.resetConfig}
              className="text-[10px] font-black text-white/30 hover:text-rose-400 uppercase tracking-widest transition-colors">
              ↺ Reset to Defaults
            </button>
            <span className="text-[9px] text-white/20 uppercase tracking-widest">Auto-saved</span>
          </div>
        </div>
      )}

      {/* ── CACHE TAB ── */}
      {mainTab === 'cache' && <CacheAdminTabDark />}
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function Field({ label, type = 'text', placeholder, value, onChange }: {
  label: string; type?: string; placeholder?: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-1.5">{label}</label>
      <input type={type} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#1a1530] border border-white/10 rounded-xl px-3 py-2.5 text-sm font-mono text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-violet-500/30" />
    </div>
  );
}

function InfoBox({ children, variant = 'info' }: { children: ReactNode; variant?: 'info' | 'warning' }) {
  return (
    <div className={`flex gap-2 p-3 rounded-xl text-[11px] leading-relaxed ${
      variant === 'warning'
        ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
        : 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
    }`}>
      <span className="flex-shrink-0">{variant === 'warning' ? '⚠️' : 'ℹ️'}</span>
      <span>{children}</span>
    </div>
  );
}
