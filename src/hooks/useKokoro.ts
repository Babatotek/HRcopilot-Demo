// ============================================
// FILE: src/hooks/useKokoro.ts
// PURPOSE: React hook — clean interface to the Kokoro inference engine.
//
//   Exposes:
//     loading    — true while model is initialising
//     progress   — 0–100 model load progress
//     result     — last InferenceResult
//     error      — last error message
//     runInference(text, opts?) — generate TTS audio
//     cancelAll()              — abort all pending tasks
//     warmUp()                 — pre-load model on mount
//
//   Integrates with:
//     - inferenceEngine.ts (queue + cache)
//     - kokoroClient.ts (worker bridge)
//     - narratorStore.ts (voice/speed settings)
// ============================================

import { useState, useCallback, useEffect, useRef } from 'react';
import { enqueue, warmUp as engineWarmUp } from '../ai/inferenceEngine';
import { initModel, onProgress, isModelReady } from '../ai/kokoroClient';
import { useNarratorStore } from '../demo/voice/narratorStore';
import type { InferenceResult, KokoroState, InferenceRequest } from '../ai/kokoroTypes';
import type { EnqueueOptions } from '../ai/inferenceEngine';

export interface UseKokoroReturn {
  /** True while the model is loading for the first time */
  loading:      boolean;
  /** 0–100 model load progress */
  progress:     number;
  /** Last successful inference result */
  result:       InferenceResult | null;
  /** Last error message, or null */
  error:        string | null;
  /** Current composite status */
  status:       KokoroState['status'];
  /** Run TTS inference. Returns the PCM result. */
  runInference: (text: string, opts?: Partial<InferenceRequest> & EnqueueOptions) => Promise<InferenceResult>;
  /** Cancel all pending tasks */
  cancelAll:    () => void;
  /** Pre-load the model (call on mount for zero-latency first narration) */
  warmUp:       () => Promise<void>;
}

export function useKokoro(): UseKokoroReturn {
  const [loading,  setLoading]  = useState(!isModelReady());
  const [progress, setProgress] = useState(isModelReady() ? 100 : 0);
  const [result,   setResult]   = useState<InferenceResult | null>(null);
  const [error,    setError]    = useState<string | null>(null);
  const [status,   setStatus]   = useState<KokoroState['status']>(
    isModelReady() ? 'ready' : 'idle',
  );

  // Track active AbortControllers so cancelAll() works
  const abortRefs = useRef<Set<AbortController>>(new Set());

  // Read voice/speed from the shared narrator store
  const kokoroVoice = useNarratorStore((s) => s.kokoroVoice);
  const kokoroSpeed = useNarratorStore((s) => s.kokoroSpeed);

  // ── Subscribe to model-load progress ────────────────────────────────────────
  useEffect(() => {
    if (isModelReady()) return; // already loaded — nothing to subscribe to

    const unsub = onProgress((msg) => {
      if (msg.phase !== 'model-load') return;

      setProgress(msg.pct);

      if (msg.pct < 100) {
        setLoading(true);
        setStatus('loading');
      } else {
        setLoading(false);
        setStatus('ready');
        setProgress(100);
      }
    });

    return unsub;
  }, []);

  // ── runInference ─────────────────────────────────────────────────────────────
  const runInference = useCallback(
    async (
      text: string,
      opts: Partial<InferenceRequest> & EnqueueOptions = {},
    ): Promise<InferenceResult> => {
      const { voice, speed, priority, signal, scriptId, onProgress: onProg, ...rest } = opts;

      const ac = new AbortController();
      abortRefs.current.add(ac);

      // Merge caller signal with our internal controller
      const mergedSignal = signal
        ? mergeSignals(ac.signal, signal)
        : ac.signal;

      setError(null);
      setStatus('generating');

      try {
        const res = await enqueue(
          {
            text,
            voice: voice ?? kokoroVoice,
            speed: speed ?? kokoroSpeed,
            ...rest,
          },
          {
            priority,
            signal:     mergedSignal,
            scriptId,
            onProgress: onProg,
          },
        );

        setResult(res);
        setStatus('ready');
        return res;

      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg);
        setStatus('error');
        throw err;
      } finally {
        abortRefs.current.delete(ac);
      }
    },
    [kokoroVoice, kokoroSpeed],
  );

  // ── cancelAll ────────────────────────────────────────────────────────────────
  const cancelAll = useCallback(() => {
    abortRefs.current.forEach((ac) => ac.abort());
    abortRefs.current.clear();
    setStatus(isModelReady() ? 'ready' : 'idle');
  }, []);

  // ── warmUp ───────────────────────────────────────────────────────────────────
  const warmUp = useCallback(async () => {
    if (isModelReady()) return;
    setLoading(true);
    setStatus('loading');
    try {
      await engineWarmUp();
      setLoading(false);
      setStatus('ready');
      setProgress(100);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      setStatus('error');
      setLoading(false);
    }
  }, []);

  // ── Cleanup on unmount ───────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      abortRefs.current.forEach((ac) => ac.abort());
      abortRefs.current.clear();
    };
  }, []);

  return { loading, progress, result, error, status, runInference, cancelAll, warmUp };
}

// ── Utility: merge two AbortSignals ───────────────────────────────────────────

function mergeSignals(a: AbortSignal, b: AbortSignal): AbortSignal {
  const ac = new AbortController();
  const abort = () => ac.abort();
  a.addEventListener('abort', abort, { once: true });
  b.addEventListener('abort', abort, { once: true });
  return ac.signal;
}
