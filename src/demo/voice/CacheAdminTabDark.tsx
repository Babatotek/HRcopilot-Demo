// ============================================
// FILE: src/demo/voice/CacheAdminTabDark.tsx
// PURPOSE: Audio cache tab — dark-first styling for admin panel.
//          No dark: variants. Always renders on dark background.
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { getCacheAdminData, nukeCache, preGenerateAll, getPreGenProgress, type CacheAdminData, type PreGenProgress } from './preRecordedManager';
import { generateKokoroPCM, isKokoroReady, loadKokoro } from './narrationEngine';
import { useNarratorStore } from './narratorStore';
import { ALL_SCRIPTS } from './scripts/index';

function flattenScripts(): { id: string; text: string }[] {
  const entries: { id: string; text: string }[] = [];
  for (const [key, value] of Object.entries(ALL_SCRIPTS)) {
    if (typeof value === 'string') {
      entries.push({ id: key, text: value });
    } else if (typeof value === 'object' && value !== null) {
      const roleMap = value as Record<string, string>;
      const text = roleMap['CEO'] ?? roleMap['HR'] ?? roleMap['FINANCE'] ?? Object.values(roleMap)[0];
      if (text) entries.push({ id: key, text });
    }
  }
  return entries;
}

const SCRIPTS = flattenScripts();

export function CacheAdminTabDark() {
  const store = useNarratorStore();
  const [data,     setData]     = useState<CacheAdminData | null>(null);
  const [progress, setProgress] = useState<PreGenProgress>(getPreGenProgress());
  const [loading,  setLoading]  = useState(false);
  const [clearing, setClearing] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    const d = await getCacheAdminData();
    setData(d);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  useEffect(() => {
    if (!progress.running) return;
    const t = setInterval(() => {
      const p = getPreGenProgress();
      setProgress({ ...p });
      if (!p.running) { clearInterval(t); refresh(); }
    }, 400);
    return () => clearInterval(t);
  }, [progress.running, refresh]);

  const handlePreGenAll = useCallback(async () => {
    if (progress.running) return;
    if (!isKokoroReady()) await loadKokoro();
    setProgress({ total: SCRIPTS.length, completed: 0, current: null, failed: [], running: true });
    preGenerateAll(
      SCRIPTS,
      (text) => generateKokoroPCM(text),
      store.kokoroVoice,
      store.kokoroSpeed,
      (p) => setProgress({ ...p }),
    ).then(() => refresh());
  }, [progress.running, store.kokoroVoice, store.kokoroSpeed, refresh]);

  const handleClear = useCallback(async () => {
    setClearing(true);
    await nukeCache();
    await refresh();
    setClearing(false);
  }, [refresh]);

  const pct = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;
  const entryCount = data?.entries.length ?? 0;
  const sizeKb     = data?.sizeKb ?? 0;
  const hitCount   = data?.stats?.totalHits ?? 0;

  return (
    <div className="space-y-5">

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: '🗂️', label: 'Cached Entries', value: loading ? '…' : String(entryCount), accent: 'violet' },
          { icon: '💾', label: 'Cache Size',      value: loading ? '…' : `${sizeKb} KB`,     accent: 'blue'   },
          { icon: '⚡', label: 'Cache Hits',      value: loading ? '…' : String(hitCount),   accent: 'emerald'},
        ].map(({ icon, label, value, accent }) => (
          <div key={label} className={`rounded-2xl p-4 border ${
            accent === 'violet'  ? 'bg-violet-500/10 border-violet-500/20'  :
            accent === 'blue'    ? 'bg-blue-500/10 border-blue-500/20'      :
            'bg-emerald-500/10 border-emerald-500/20'
          }`}>
            <div className="text-2xl mb-2">{icon}</div>
            <p className={`text-xl font-black ${
              accent === 'violet'  ? 'text-violet-300'  :
              accent === 'blue'    ? 'text-blue-300'    :
              'text-emerald-300'
            }`}>{value}</p>
            <p className="text-[9px] font-bold uppercase tracking-widest text-white/40 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Pre-generation ── */}
      <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-[11px] font-black text-white uppercase tracking-tight mb-1">
              Pre-generate All Scripts
            </p>
            <p className="text-[10px] text-white/40 leading-relaxed">
              Runs Kokoro on all {SCRIPTS.length} narration scripts and stores them in IndexedDB.
              After this, every script plays instantly from cache with ~0ms latency.
            </p>
          </div>
          <button onClick={handlePreGenAll}
            disabled={progress.running || store.status === 'speaking'}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-violet-600 text-white hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-500/20">
            {progress.running
              ? <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : '▶'}
            {progress.running ? 'Generating…' : 'Pre-generate All'}
          </button>
        </div>

        {(progress.running || progress.completed > 0) && (
          <div className="space-y-2">
            <div className="flex justify-between text-[9px] font-bold text-white/40 uppercase tracking-widest">
              <span>
                {progress.current
                  ? `Generating: ${progress.current}`
                  : progress.running ? 'Starting…' : '✓ Complete'}
              </span>
              <span>{progress.completed}/{progress.total} · {pct}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full transition-all duration-300"
                style={{ width: `${pct}%` }} />
            </div>
            {progress.failed.length > 0 && (
              <p className="text-[9px] text-rose-400 font-bold">
                {progress.failed.length} failed: {progress.failed.slice(0, 3).join(', ')}
                {progress.failed.length > 3 && ` +${progress.failed.length - 3} more`}
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── Cached entries ── */}
      <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
          <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">
            Cached Audio ({entryCount})
          </p>
          <div className="flex gap-3">
            <button onClick={refresh} disabled={loading}
              className="text-[9px] font-black text-white/30 hover:text-violet-400 uppercase tracking-widest transition-colors">
              {loading ? '…' : '↻ Refresh'}
            </button>
            <button onClick={handleClear} disabled={clearing || entryCount === 0}
              className="text-[9px] font-black text-white/30 hover:text-rose-400 uppercase tracking-widest transition-colors disabled:opacity-30">
              {clearing ? 'Clearing…' : '🗑 Clear All'}
            </button>
          </div>
        </div>

        <div className="max-h-52 overflow-y-auto">
          {entryCount === 0 ? (
            <div className="py-10 text-center space-y-1">
              <p className="text-2xl opacity-20">📭</p>
              <p className="text-[10px] text-white/30 font-medium">No cached audio yet.</p>
              <p className="text-[9px] text-white/20">
                Cache fills automatically as scripts are narrated, or click Pre-generate All.
              </p>
            </div>
          ) : (
            data!.entries.map((entry) => (
              <div key={entry.cacheKey}
                className="flex items-center justify-between px-5 py-2.5 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-[10px] font-mono text-violet-400 flex-shrink-0 truncate max-w-[140px]">
                    {entry.scriptId}
                  </span>
                  <span className="text-[9px] text-white/30 truncate">
                    {entry.voiceId} · {entry.speed.toFixed(2)}× · {(entry.durationMs / 1000).toFixed(1)}s
                  </span>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0 ml-2">
                  <span className="text-[9px] text-white/30">{entry.hitCount} hits</span>
                  <span className="text-[9px] text-white/30">{Math.round(entry.pcmData.length * 4 / 1024)} KB</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── How it works ── */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5">
        <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-3">How the Cache Works</p>
        <div className="space-y-2.5">
          {[
            { icon: '⚡', label: 'Layer 2 — Cache Hit',   desc: 'Plays instantly from IndexedDB (~0ms latency)' },
            { icon: '🎙️', label: 'Layer 1 — Live Kokoro', desc: 'Cache miss → Kokoro generates, then writes to cache' },
            { icon: '🔄', label: 'Auto-warm',              desc: 'Cache fills passively as scripts are narrated during demos' },
            { icon: '📦', label: 'Persistent',             desc: 'Survives page refresh and browser restart' },
          ].map(({ icon, label, desc }) => (
            <div key={label} className="flex items-start gap-3">
              <span className="text-base flex-shrink-0 mt-0.5">{icon}</span>
              <div>
                <span className="text-[9px] font-black text-blue-300 uppercase tracking-widest">{label}</span>
                <span className="text-[9px] text-blue-400/70 ml-2">{desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
