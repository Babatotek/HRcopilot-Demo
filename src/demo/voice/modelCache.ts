// ============================================
// FILE: src/demo/voice/modelCache.ts
// PURPOSE: Manage the Kokoro model's browser Cache API storage.
//
// @huggingface/transformers uses the Cache API (window.caches)
// with useBrowserCache=true by default. Model files are stored
// permanently under the cache name 'transformers-cache'.
//
// This module:
//   1. Checks if the model is already cached (no download needed)
//   2. Reports cache size
//   3. Allows clearing the model cache
//   4. Configures env to ensure caching is always on
// ============================================

import { env } from '@huggingface/transformers';

// Cache name used by @huggingface/transformers
const HF_CACHE_NAME = 'transformers-cache';

// Model ID we're using
const MODEL_ID = 'onnx-community/Kokoro-82M-ONNX';

// ── Ensure caching is always enabled ──────────────────────────────────────────

export function configurePermanentCache(): void {
  // Force browser cache on — survives page refresh, browser restart
  env.useBrowserCache = true;
  // Keep local models enabled so the worker can serve from /models/
  // Do NOT set allowLocalModels = false here — that would override
  // kokoroWorker.ts which sets allowLocalModels=true and allowRemoteModels=false
  console.log('[ModelCache] Browser cache enabled — model persists across sessions');
}

// ── Request persistent storage (eviction-proof) ───────────────────────────────
// Asks the browser to never evict this origin's storage without user permission.
// Covers both Cache API (model weights) and IndexedDB (audio PCM cache).
// Safe to call multiple times — browser remembers the grant.

export async function requestPersistentStorage(): Promise<boolean> {
  if (!navigator.storage?.persist) return false;

  try {
    const already = await navigator.storage.persisted();
    if (already) {
      console.log('[ModelCache] ✅ Persistent storage already granted');
      return true;
    }

    const granted = await navigator.storage.persist();
    console.log(`[ModelCache] Persistent storage ${granted ? '✅ granted' : '⚠ denied (browser discretion)'}`);
    return granted;
  } catch (err) {
    console.warn('[ModelCache] persist() failed:', err);
    return false;
  }
}

// ── Check if model is already cached ──────────────────────────────────────────

export async function isModelCached(): Promise<boolean> {
  if (!('caches' in window)) return false;

  try {
    const cache = await window.caches.open(HF_CACHE_NAME);
    const keys  = await cache.keys();

    // Check if any key contains our model ID
    const modelKeys = keys.filter((req) =>
      req.url.includes(MODEL_ID) || req.url.includes('Kokoro'),
    );

    return modelKeys.length > 0;
  } catch {
    return false;
  }
}

// ── Get cache size ─────────────────────────────────────────────────────────────

export async function getModelCacheSizeMb(): Promise<number> {
  if (!('caches' in window)) return 0;

  try {
    const cache = await window.caches.open(HF_CACHE_NAME);
    const keys  = await cache.keys();

    let totalBytes = 0;
    for (const req of keys) {
      if (!req.url.includes(MODEL_ID) && !req.url.includes('Kokoro')) continue;
      try {
        const res = await cache.match(req);
        if (!res) continue;
        const blob = await res.blob();
        totalBytes += blob.size;
      } catch { /* skip */ }
    }

    return Math.round(totalBytes / (1024 * 1024) * 10) / 10; // MB with 1 decimal
  } catch {
    return 0;
  }
}

// ── Get all cached file names ──────────────────────────────────────────────────

export async function getCachedModelFiles(): Promise<string[]> {
  if (!('caches' in window)) return [];

  try {
    const cache = await window.caches.open(HF_CACHE_NAME);
    const keys  = await cache.keys();

    return keys
      .filter((req) => req.url.includes(MODEL_ID) || req.url.includes('Kokoro'))
      .map((req) => {
        const parts = req.url.split('/');
        return parts[parts.length - 1] || req.url;
      });
  } catch {
    return [];
  }
}

// ── Clear model cache ──────────────────────────────────────────────────────────

export async function clearModelCache(): Promise<void> {
  if (!('caches' in window)) return;

  try {
    const cache = await window.caches.open(HF_CACHE_NAME);
    const keys  = await cache.keys();

    for (const req of keys) {
      if (req.url.includes(MODEL_ID) || req.url.includes('Kokoro')) {
        await cache.delete(req);
      }
    }

    console.log('[ModelCache] Model cache cleared');
  } catch (err) {
    console.warn('[ModelCache] Clear failed:', err);
  }
}

// ── Cache API availability ─────────────────────────────────────────────────────

export function isCacheApiAvailable(): boolean {
  return 'caches' in window;
}

// ── Storage estimate ───────────────────────────────────────────────────────────

export async function getStorageEstimate(): Promise<{ usedMb: number; quotaMb: number } | null> {
  if (!navigator.storage?.estimate) return null;

  try {
    const { usage = 0, quota = 0 } = await navigator.storage.estimate();
    return {
      usedMb:  Math.round(usage  / (1024 * 1024)),
      quotaMb: Math.round(quota  / (1024 * 1024)),
    };
  } catch {
    return null;
  }
}
