// ============================================
// FILE: src/demo/voice/preRecordedManager.ts
// PURPOSE: Manages the Kokoro-generated audio cache.
//   - On first Kokoro speak: generate + cache to IndexedDB
//   - On subsequent calls: serve from cache instantly
//   - Background pre-generation of all script IDs
//   - Exposes cache status for admin panel
// ============================================

import {
  cacheAudio,
  getCachedAudio,
  clearAudioCache,
  getAllCachedEntries,
  getCacheStats,
  getCacheSizeKb,
  type CachedAudio,
  type CacheStats,
} from './audioCache';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface PreGenProgress {
  total:     number;
  completed: number;
  current:   string | null;
  failed:    string[];
  running:   boolean;
}

type ProgressCallback = (p: PreGenProgress) => void;

// ── Module-level state ─────────────────────────────────────────────────────────

let _preGenProgress: PreGenProgress = {
  total: 0, completed: 0, current: null, failed: [], running: false,
};
let _progressCb: ProgressCallback | null = null;

function emitProgress(patch: Partial<PreGenProgress>): void {
  _preGenProgress = { ..._preGenProgress, ...patch };
  _progressCb?.(_preGenProgress);
}

// ── Cache read ─────────────────────────────────────────────────────────────────

/**
 * Try to serve audio from IndexedDB cache.
 * Returns the PCM Float32Array + sampleRate + durationMs, or null on miss.
 */
export async function getFromCache(
  scriptId: string,
  voiceId:  string,
  speed:    number,
): Promise<{ pcm: Float32Array; sampleRate: number; durationMs: number } | null> {
  try {
    const entry = await getCachedAudio(scriptId, voiceId, speed);
    if (!entry) return null;

    return {
      pcm:        entry.pcmData,
      sampleRate: entry.sampleRate,
      durationMs: entry.durationMs,
    };
  } catch (err) {
    console.warn('[AudioCache] Read failed:', err);
    return null;
  }
}

// ── Cache write ────────────────────────────────────────────────────────────────

/**
 * Store a Kokoro-generated audio result.
 * Called automatically after every successful Kokoro generation.
 * Fails silently — cache write errors never break playback.
 */
export async function saveToCache(
  scriptId:   string,
  voiceId:    string,
  speed:      number,
  pcm:        Float32Array,
  sampleRate: number,
): Promise<void> {
  try {
    await cacheAudio(scriptId, voiceId, speed, pcm, sampleRate);
    console.log(`[AudioCache] ✅ Cached: ${scriptId}`);
  } catch (err) {
    console.warn('[AudioCache] Write failed (non-fatal):', err);
  }
}

// ── Background pre-generation ──────────────────────────────────────────────────

/**
 * Pre-generate and cache audio for a list of script entries.
 * Runs in the background — does not block the UI.
 * Skips entries already in cache.
 *
 * @param entries  Array of { id, text } to generate
 * @param generate Function that calls Kokoro and returns { pcm, sampleRate }
 * @param voiceId  Current voice ID (for cache key)
 * @param speed    Current speed (for cache key)
 * @param onProgress Optional progress callback
 */
export async function preGenerateAll(
  entries:    { id: string; text: string }[],
  generate:   (text: string) => Promise<{ pcm: Float32Array; sampleRate: number }>,
  voiceId:    string,
  speed:      number,
  onProgress?: ProgressCallback,
): Promise<void> {
  if (_preGenProgress.running) return; // already running

  _progressCb = onProgress ?? null;
  emitProgress({ total: entries.length, completed: 0, current: null, failed: [], running: true });

  for (const entry of entries) {
    // Check cache first — skip if already cached
    const cached = await getCachedAudio(entry.id, voiceId, speed);
    if (cached) {
      emitProgress({ completed: _preGenProgress.completed + 1 });
      continue;
    }

    emitProgress({ current: entry.id });

    try {
      const { pcm, sampleRate } = await generate(entry.text);
      await saveToCache(entry.id, voiceId, speed, pcm, sampleRate);
      emitProgress({ completed: _preGenProgress.completed + 1 });
    } catch (err) {
      console.warn(`[PreGen] Failed: ${entry.id}`, err);
      emitProgress({
        completed: _preGenProgress.completed + 1,
        failed:    [..._preGenProgress.failed, entry.id],
      });
    }

    // Yield to the event loop between generations to keep UI responsive
    await new Promise<void>((r) => setTimeout(r, 50));
  }

  emitProgress({ running: false, current: null });
  _progressCb = null;
}

export function getPreGenProgress(): PreGenProgress {
  return { ..._preGenProgress };
}

// ── Admin panel data ───────────────────────────────────────────────────────────

export interface CacheAdminData {
  entries:   CachedAudio[];
  stats:     CacheStats | null;
  sizeKb:    number;
}

export async function getCacheAdminData(): Promise<CacheAdminData> {
  const [entries, stats, sizeKb] = await Promise.all([
    getAllCachedEntries(),
    getCacheStats(),
    getCacheSizeKb(),
  ]);
  return { entries, stats, sizeKb };
}

export async function nukeCache(): Promise<void> {
  await clearAudioCache();
  emitProgress({ total: 0, completed: 0, current: null, failed: [], running: false });
}
