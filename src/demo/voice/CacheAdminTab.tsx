// ============================================
// FILE: src/demo/voice/CacheAdminTab.tsx
// PURPOSE: Cache status tab inside NarratorAdminPanel
//   Shows cached entries, size, hit/miss stats,
//   pre-generate-all button, clear cache button.
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { getCacheAdminData, nukeCache, preGenerateAll, getPreGenProgress, type CacheAdminData, type PreGenProgress } from './preRecordedManager';
import { generateKokoroPCM, isKokoroReady, loadKokoro } from './narrationEngine';
import { useNarratorStore } from './narratorStore';
import { ALL_SCRIPTS } from './scripts/index';

// Flatten ALL_SCRIPTS into { id, text } pairs for pre-generation
function flattenScripts(): { id: string; text: string }[] {
  const entries: { id: string; text: string }[] = [];
  for (const [key, value] of Object.entries(ALL_SCRIPTS)) {
    if (typeof value === 'string') {
      entries.push({ id: key, text: value });
    } else if (typeof value === 'object' && value !== null) {
      // Role-keyed scripts — use CEO variant as canonical
      const roleMap = value as Record<string, string>;
      const text = roleMap['CEO'] ?? roleMap['HR'] ?? roleMap['FINANCE'] ?? Object.values(roleMap)[0];
      if (text) entries.push({ id: key, text });
    }
  }
  return entries;
}

export function CacheAdminTab() {
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

  // Poll progress while pre-gen is running
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

    // Ensure Kokoro is loaded first
    if (!isKokoroReady()) {
      await loadKokoro();
    }

    const scripts = flattenScripts();
    setProgress({ total: scripts.length, completed: 0, current: null, failed: [], running: true });

    // Run in background — don't await
    preGenerateAll(
      scripts,
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

  const pct = progress.total > 0
    ? Math.round((progress.completed / progress.total) * 100)
    : 0;

  return (
    <div className="space-y-5">

      {/* ── Stats row ── */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          label="Cached Entries"
          value={data?.entries.length ?? '—'}
          icon="🗂️"
          color="violet"
        />
        <StatCard
          label="Cache Size"
          value={data ? `${data.sizeKb} KB` : '—'}
          icon="💾"
          color="blue"
        />
        <StatCard
          label="Cache Hits"
          value={data?.stats ? `${data.stats.totalHits}` : '—'}
          icon="⚡"
          color="emerald"
        />
      </div>

      {/* ── Pre-generation ── */}
      <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-5 border border-slate-200 dark:border-white/10">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-tight">
              Pre-generate All Scripts
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Runs Kokoro on all {flattenScripts().length} narration scripts and stores them in IndexedDB.
              After this, every script plays instantly from cache.
            </p>
          </div>
          <button
            onClick={handlePreGenAll}
            disabled={progress.running || store.status === 'speaking'}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-500/20 ml-4"
          >
            {progress.running ? (
              <span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
            ) : '▶'}
            {progress.running ? 'Generating…' : 'Pre-generate All'}
          </button>
        </div>

        {/* Progress bar */}
        {(progress.running || progress.completed > 0) && (
          <div className="space-y-2">
            <div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase tracking-widest">
              <span>{progress.current ? `Generating: ${progress.current}` : progress.running ? 'Starting…' : 'Complete'}</span>
              <span>{progress.completed}/{progress.total} · {pct}%</span>
            </div>
            <div className="h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
            {progress.failed.length > 0 && (
              <p className="text-[9px] text-rose-500 font-bold">
                {progress.failed.length} failed: {progress.failed.slice(0, 3).join(', ')}
                {progress.failed.length > 3 && ` +${progress.failed.length - 3} more`}
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── Cached entries list ── */}
      <div className="bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 dark:border-white/10">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
            Cached Audio ({data?.entries.length ?? 0})
          </p>
          <div className="flex gap-2">
            <button
              onClick={refresh}
              disabled={loading}
              className="text-[9px] font-black text-slate-400 hover:text-violet-600 uppercase tracking-widest transition-colors"
            >
              {loading ? '…' : '↻ Refresh'}
            </button>
            <button
              onClick={handleClear}
              disabled={clearing || (data?.entries.length ?? 0) === 0}
              className="text-[9px] font-black text-slate-400 hover:text-rose-500 uppercase tracking-widest transition-colors disabled:opacity-40"
            >
              {clearing ? 'Clearing…' : '🗑 Clear All'}
            </button>
          </div>
        </div>

        <div className="max-h-48 overflow-y-auto">
          {!data || data.entries.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-[10px] text-slate-400 font-medium">No cached audio yet.</p>
              <p className="text-[9px] text-slate-400 mt-1">
                Cache fills automatically as scripts are narrated, or click Pre-generate All.
              </p>
            </div>
          ) : (
            data.entries.map((entry) => (
              <div
                key={entry.cacheKey}
                className="flex items-center justify-between px-5 py-2.5 border-b border-slate-100 dark:border-white/5 last:border-0 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-[10px] font-mono text-violet-600 dark:text-violet-400 flex-shrink-0">
                    {entry.scriptId}
                  </span>
                  <span className="text-[9px] text-slate-400 truncate">
                    {entry.voiceId} · {entry.speed.toFixed(2)}× · {(entry.durationMs / 1000).toFixed(1)}s
                  </span>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                  <span className="text-[9px] text-slate-400">
                    {entry.hitCount} hits
                  </span>
                  <span className="text-[9px] text-slate-400">
                    {Math.round(entry.pcmData.length * 4 / 1024)} KB
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── How it works ── */}
      <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-2xl p-4">
        <p className="text-[10px] font-black text-blue-700 dark:text-blue-300 uppercase tracking-widest mb-2">
          How the cache works
        </p>
        <div className="space-y-1.5">
          {[
            ['⚡', 'Layer 2', 'Cache hit → plays instantly from IndexedDB (~0ms latency)'],
            ['🎙️', 'Layer 1', 'Cache miss → Kokoro generates live, then writes to cache'],
            ['🔄', 'Auto-warm', 'Cache fills passively as scripts are narrated during demos'],
            ['📦', 'Persistent', 'Survives page refresh and browser restart'],
          ].map(([icon, label, desc]) => (
            <div key={label} className="flex items-start gap-2">
              <span className="text-sm flex-shrink-0">{icon}</span>
              <div>
                <span className="text-[9px] font-black text-blue-700 dark:text-blue-300 uppercase tracking-widest">
                  {label}
                </span>
                <span className="text-[9px] text-blue-600 dark:text-blue-400 ml-1.5">{desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Stat card ──────────────────────────────────────────────────────────────────

function StatCard({
  label, value, icon, color,
}: { label: string; value: string | number; icon: string; color: 'violet' | 'blue' | 'emerald' }) {
  const colorMap = {
    violet:  'bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/20 text-violet-700 dark:text-violet-300',
    blue:    'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-300',
    emerald: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300',
  };

  return (
    <div className={`rounded-2xl p-4 border ${colorMap[color]}`}>
      <div className="text-xl mb-1">{icon}</div>
      <p className="text-lg font-black">{value}</p>
      <p className="text-[9px] font-bold uppercase tracking-widest opacity-70">{label}</p>
    </div>
  );
}
