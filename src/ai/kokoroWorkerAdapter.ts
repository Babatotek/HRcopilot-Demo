// ============================================
// FILE: src/ai/kokoroWorkerAdapter.ts
// PURPOSE: Web Worker — typed protocol adapter over the existing Kokoro worker logic.
//
//   Accepts the canonical WorkerInboundMessage protocol (INIT_MODEL, RUN_INFERENCE,
//   CANCEL_TASK, GET_STATUS) and translates to/from the existing kokoroWorker.ts
//   message format (load, generate, check-cache).
//
//   This keeps the existing kokoroWorker.ts untouched while exposing the new
//   enterprise-grade typed API to kokoroClient.ts.
//
//   Runs in Worker context (self).
// ============================================

import { KokoroTTS, env } from 'kokoro-js';
import type {
  WorkerInboundMessage,
  WorkerOutboundMessage,
} from './kokoroTypes';

// ── Local model config (mirrors kokoroWorker.ts) ───────────────────────────────
(env as any).localModelPath    = '/models/';
(env as any).allowLocalModels  = true;
(env as any).allowRemoteModels = false;
(env as any).useBrowserCache   = true;

// ── State ──────────────────────────────────────────────────────────────────────
let tts:         KokoroTTS | null = null;
let modelLoaded  = false;
let busy         = false;
const cancelSet  = new Set<string>(); // taskIds that have been cancelled
let queueDepth   = 0;

// ── Helpers ────────────────────────────────────────────────────────────────────

function post(msg: WorkerOutboundMessage, transfer?: Transferable[]): void {
  if (transfer?.length) {
    self.postMessage(msg, { transfer });
  } else {
    self.postMessage(msg);
  }
}

// ── Message handler ────────────────────────────────────────────────────────────

self.onmessage = async (e: MessageEvent<WorkerInboundMessage>) => {
  const msg = e.data;

  switch (msg.type) {

    // ── INIT_MODEL ────────────────────────────────────────────────────────────
    case 'INIT_MODEL': {
      if (modelLoaded) {
        // Already loaded — report 100% immediately
        post({ type: 'PROGRESS', phase: 'model-load', pct: 100, label: 'Model ready (cached)' });
        return;
      }

      try {
        post({ type: 'PROGRESS', phase: 'model-load', pct: 0, label: 'Initialising model…' });

        tts = await KokoroTTS.from_pretrained(msg.modelId, {
          dtype:  'q8',
          device: 'wasm' as any,
          progress_callback: (info: { status: string; name?: string; progress?: number }) => {
            if (info.status === 'progress' && info.progress !== undefined) {
              post({
                type:  'PROGRESS',
                phase: 'model-load',
                pct:   Math.round(info.progress),
                label: info.name ?? 'Loading…',
              });
            }
            if (info.status === 'ready') {
              post({ type: 'PROGRESS', phase: 'model-load', pct: 100, label: 'Model ready' });
            }
          },
        });

        modelLoaded = true;
        post({ type: 'PROGRESS', phase: 'model-load', pct: 100, label: 'Model ready' });

      } catch (err) {
        post({
          type:    'ERROR',
          code:    'MODEL_LOAD_FAILED',
          message: err instanceof Error ? err.message : String(err),
        });
      }
      break;
    }

    // ── RUN_INFERENCE ─────────────────────────────────────────────────────────
    case 'RUN_INFERENCE': {
      const { taskId, text, voice, speed } = msg;

      if (!modelLoaded || !tts) {
        post({ type: 'ERROR', taskId, code: 'MODEL_NOT_LOADED', message: 'Model not loaded. Call INIT_MODEL first.' });
        return;
      }

      queueDepth++;
      busy = true;

      try {
        post({ type: 'PROGRESS', phase: 'inference', taskId, pct: 0, label: 'Generating audio…' });

        const result = await tts.generate(text, { voice, speed });

        // Check if cancelled while generating
        if (cancelSet.has(taskId)) {
          cancelSet.delete(taskId);
          post({ type: 'ERROR', taskId, code: 'TASK_CANCELLED', message: 'Task was cancelled' });
          return;
        }

        // Transfer the ArrayBuffer to avoid copying 88MB+ of PCM data
        const srcArray  = result.audio;
        const pcmBuffer = srcArray.buffer.slice(
          srcArray.byteOffset,
          srcArray.byteOffset + srcArray.byteLength,
        );
        const pcm        = new Float32Array(pcmBuffer);
        const sampleRate = result.sampling_rate as number; // 24000 Hz
        const durationMs = Math.round((pcm.length / sampleRate) * 1000);

        post(
          { type: 'RESULT', taskId, pcm, sampleRate, durationMs },
          [pcmBuffer],
        );

      } catch (err) {
        post({
          type:    'ERROR',
          taskId,
          code:    'INFERENCE_FAILED',
          message: err instanceof Error ? err.message : String(err),
        });
      } finally {
        queueDepth = Math.max(0, queueDepth - 1);
        busy = queueDepth > 0;
      }
      break;
    }

    // ── CANCEL_TASK ───────────────────────────────────────────────────────────
    case 'CANCEL_TASK': {
      // Mark for cancellation — checked after generate() returns
      cancelSet.add(msg.taskId);
      break;
    }

    // ── GET_STATUS ────────────────────────────────────────────────────────────
    case 'GET_STATUS': {
      post({
        type:        'STATUS',
        modelLoaded,
        busy,
        queueDepth,
      });
      break;
    }
  }
};
