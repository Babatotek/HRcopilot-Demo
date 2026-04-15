// ============================================
// FILE: src/ai/inferenceEngine.ts
// PURPOSE: Priority queue + AbortController wrapper over kokoroClient.
//
//   - Queues inference requests with optional priority
//   - Supports AbortSignal cancellation
//   - Reuses the single worker session (no reload per request)
//   - Emits progress events per task
//   - Integrates with Dexie audio cache (audioCache.ts) for instant replay
// ============================================

import {
  initModel,
  runInference,
  cancelTask,
  onProgress,
  isModelReady,
} from './kokoroClient';
import { getFromCache, saveToCache } from '../demo/voice/preRecordedManager';
import type { InferenceRequest, InferenceResult, ProgressMessage } from './kokoroTypes';

// ── Queue item ─────────────────────────────────────────────────────────────────

interface QueueItem {
  taskId:   string;
  request:  InferenceRequest & { scriptId?: string };
  priority: number;          // higher = runs first
  signal?:  AbortSignal;
  resolve:  (r: InferenceResult) => void;
  reject:   (e: Error) => void;
  onProgress?: (pct: number) => void;
}

// ── Engine state ───────────────────────────────────────────────────────────────

const _queue:   QueueItem[] = [];
let   _running  = false;
let   _taskSeq  = 0;

// ── Progress forwarding ────────────────────────────────────────────────────────

const _taskProgressMap = new Map<string, (pct: number) => void>();

onProgress((msg: ProgressMessage) => {
  if (msg.taskId && _taskProgressMap.has(msg.taskId)) {
    _taskProgressMap.get(msg.taskId)!(msg.pct);
  }
});

// ── Queue processor ────────────────────────────────────────────────────────────

async function processQueue(): Promise<void> {
  if (_running || _queue.length === 0) return;
  _running = true;

  // Sort by priority descending (higher priority first)
  _queue.sort((a, b) => b.priority - a.priority);

  while (_queue.length > 0) {
    const item = _queue.shift()!;

    // Skip if aborted before we even started
    if (item.signal?.aborted) {
      item.reject(new Error('[TASK_CANCELLED] Aborted before start'));
      continue;
    }

    // Register progress handler
    if (item.onProgress) {
      _taskProgressMap.set(item.taskId, item.onProgress);
    }

    try {
      const result = await runInference(item.request);
      item.resolve(result);

      // Write to Dexie cache if scriptId provided
      if (item.request.scriptId) {
        saveToCache(item.request.scriptId, item.request.voice ?? 'af_heart', item.request.speed ?? 1.0, result.pcm, result.sampleRate)
          .catch(() => {/* non-fatal */});
      }
    } catch (err) {
      item.reject(err instanceof Error ? err : new Error(String(err)));
    } finally {
      _taskProgressMap.delete(item.taskId);
    }
  }

  _running = false;
}

// ── Public API ─────────────────────────────────────────────────────────────────

export interface EnqueueOptions {
  /** Higher number = runs sooner. Default: 0 */
  priority?:   number;
  /** AbortSignal to cancel the task */
  signal?:     AbortSignal;
  /** Cache key — if provided, checks Dexie cache before generating */
  scriptId?:   string;
  /** Progress callback (0–100) */
  onProgress?: (pct: number) => void;
}

/**
 * Enqueue a TTS inference request.
 * Returns a Promise that resolves with the PCM result.
 *
 * Cache hit path: scriptId → Dexie → instant resolve (no worker call).
 * Cache miss path: worker → generate → Dexie write → resolve.
 */
export async function enqueue(
  request: InferenceRequest,
  opts: EnqueueOptions = {},
): Promise<InferenceResult> {
  const { priority = 0, signal, scriptId, onProgress: onProg } = opts;

  // ── Cache hit check ──────────────────────────────────────────────────────────
  if (scriptId) {
    const cached = await getFromCache(scriptId, request.voice ?? 'af_heart', request.speed ?? 1.0);
    if (cached) {
      return {
        taskId:     `cache_${scriptId}`,
        pcm:        cached.pcm,
        sampleRate: cached.sampleRate,
        durationMs: cached.durationMs,
      };
    }
  }

  // ── Ensure model is loaded ───────────────────────────────────────────────────
  if (!isModelReady()) {
    await initModel();
  }

  // ── Enqueue ──────────────────────────────────────────────────────────────────
  const taskId = `q_${++_taskSeq}_${Date.now()}`;

  return new Promise<InferenceResult>((resolve, reject) => {
    // Handle abort before enqueue
    if (signal?.aborted) {
      reject(new Error('[TASK_CANCELLED] Already aborted'));
      return;
    }

    const item: QueueItem = {
      taskId,
      request: { ...request, scriptId },
      priority,
      signal,
      resolve,
      reject,
      onProgress: onProg,
    };

    // Wire AbortSignal → cancelTask
    signal?.addEventListener('abort', () => {
      const idx = _queue.indexOf(item);
      if (idx !== -1) {
        _queue.splice(idx, 1);
        reject(new Error('[TASK_CANCELLED] Aborted'));
      } else {
        cancelTask(taskId);
      }
    }, { once: true });

    _queue.push(item);
    processQueue();
  });
}

/**
 * Ensure the model is warm before the first user interaction.
 * Call this on app mount for zero-latency first narration.
 */
export async function warmUp(): Promise<void> {
  if (!isModelReady()) {
    await initModel();
  }
}

/** Current queue depth (pending tasks not yet started). */
export function getQueueDepth(): number {
  return _queue.length;
}
