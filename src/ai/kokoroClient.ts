// ============================================
// FILE: src/ai/kokoroClient.ts
// PURPOSE: Promise-based bridge between the main thread and the Kokoro Web Worker.
//
//   - Owns the Worker instance (singleton)
//   - Dispatches typed messages
//   - Resolves/rejects pending promises via taskId correlation
//   - Handles worker crash + auto-restart
//   - Exposes clean async API: initModel(), runInference(), getStatus()
// ============================================

import type {
  WorkerInboundMessage,
  WorkerOutboundMessage,
  InferenceRequest,
  InferenceResult,
  StatusMessage,
  ProgressMessage,
} from './kokoroTypes';

// ── Config ─────────────────────────────────────────────────────────────────────

const DEFAULT_MODEL_ID = 'onnx-community/Kokoro-82M-ONNX';
const INFERENCE_TIMEOUT_MS = 60_000; // 60 s — long text can take a while on WASM

// ── Pending task registry ──────────────────────────────────────────────────────

interface PendingTask {
  resolve: (result: InferenceResult) => void;
  reject:  (err: Error) => void;
  timer:   ReturnType<typeof setTimeout>;
}

// ── Singleton state ────────────────────────────────────────────────────────────

let _worker:      Worker | null = null;
let _modelReady = false;
let _initPromise: Promise<void> | null = null;

const _pending = new Map<string, PendingTask>();
const _progressListeners = new Set<(msg: ProgressMessage) => void>();
const _statusListeners   = new Set<(msg: StatusMessage)   => void>();

// ── Worker factory ─────────────────────────────────────────────────────────────

function createWorker(): Worker {
  // Vite resolves ?worker imports at build time — this is the canonical pattern.
  // The worker file is src/demo/voice/kokoroWorker.ts (existing, battle-tested).
  // We wrap it with the new typed protocol via the adapter worker below.
  const w = new Worker(
    new URL('./kokoroWorkerAdapter.ts', import.meta.url),
    { type: 'module' },
  );

  w.onmessage = (e: MessageEvent<WorkerOutboundMessage>) => {
    handleWorkerMessage(e.data);
  };

  w.onerror = (e) => {
    console.error('[KokoroClient] Worker error:', e.message);
    rejectAll(new Error(`Worker crash: ${e.message}`));
    // Auto-restart
    _worker    = null;
    _modelReady = false;
    _initPromise = null;
  };

  return w;
}

function getWorker(): Worker {
  if (!_worker) _worker = createWorker();
  return _worker;
}

// ── Message dispatcher ─────────────────────────────────────────────────────────

function send(msg: WorkerInboundMessage, transfer?: Transferable[]): void {
  const w = getWorker();
  if (transfer?.length) {
    w.postMessage(msg, transfer);
  } else {
    w.postMessage(msg);
  }
}

// ── Inbound message handler ────────────────────────────────────────────────────

function handleWorkerMessage(msg: WorkerOutboundMessage): void {
  switch (msg.type) {
    case 'RESULT': {
      const task = _pending.get(msg.taskId);
      if (!task) return;
      clearTimeout(task.timer);
      _pending.delete(msg.taskId);
      task.resolve({
        taskId:     msg.taskId,
        pcm:        msg.pcm,
        sampleRate: msg.sampleRate,
        durationMs: msg.durationMs,
      });
      break;
    }

    case 'ERROR': {
      if (msg.taskId) {
        const task = _pending.get(msg.taskId);
        if (task) {
          clearTimeout(task.timer);
          _pending.delete(msg.taskId);
          task.reject(new Error(`[${msg.code}] ${msg.message}`));
        }
      } else {
        // Global error (e.g. model load failure)
        rejectAll(new Error(`[${msg.code}] ${msg.message}`));
        _modelReady  = false;
        _initPromise = null;
      }
      break;
    }

    case 'PROGRESS': {
      if (msg.phase === 'model-load' && msg.pct === 100) {
        _modelReady = true;
      }
      _progressListeners.forEach((fn) => fn(msg));
      break;
    }

    case 'STATUS': {
      _statusListeners.forEach((fn) => fn(msg));
      break;
    }
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function rejectAll(err: Error): void {
  _pending.forEach((task) => {
    clearTimeout(task.timer);
    task.reject(err);
  });
  _pending.clear();
}

function generateTaskId(): string {
  return `task_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ── Public API ─────────────────────────────────────────────────────────────────

/**
 * Load the Kokoro model in the worker (idempotent — safe to call multiple times).
 * Returns immediately if already loaded.
 */
export function initModel(modelId = DEFAULT_MODEL_ID): Promise<void> {
  if (_modelReady) return Promise.resolve();

  if (_initPromise) return _initPromise;

  _initPromise = new Promise<void>((resolve, reject) => {
    // Listen for the first PROGRESS pct=100 (model-load phase) or ERROR
    const onProgress = (msg: ProgressMessage) => {
      if (msg.phase === 'model-load' && msg.pct === 100) {
        _progressListeners.delete(onProgress);
        _modelReady = true;
        resolve();
      }
    };

    const onError = (msg: WorkerOutboundMessage) => {
      if (msg.type === 'ERROR' && !msg.taskId) {
        _progressListeners.delete(onProgress);
        _initPromise = null;
        reject(new Error(`[${msg.code}] ${msg.message}`));
      }
    };

    _progressListeners.add(onProgress);
    // Piggyback on the message handler — errors without taskId are model-load errors
    const w = getWorker();
    const origHandler = w.onmessage;
    w.onmessage = (e: MessageEvent<WorkerOutboundMessage>) => {
      origHandler?.(e);
      onError(e.data);
    };

    send({ type: 'INIT_MODEL', modelId });
  });

  return _initPromise;
}

/**
 * Run TTS inference. Resolves with PCM audio data.
 * Rejects on error or timeout.
 */
export function runInference(req: InferenceRequest): Promise<InferenceResult> {
  const taskId = generateTaskId();

  return new Promise<InferenceResult>((resolve, reject) => {
    const timer = setTimeout(() => {
      _pending.delete(taskId);
      reject(new Error(`[TIMEOUT] Inference timed out after ${INFERENCE_TIMEOUT_MS}ms`));
    }, INFERENCE_TIMEOUT_MS);

    _pending.set(taskId, { resolve, reject, timer });

    send({
      type:   'RUN_INFERENCE',
      taskId,
      text:   req.text,
      voice:  req.voice  ?? 'af_heart',
      speed:  req.speed  ?? 1.0,
    });
  });
}

/**
 * Cancel an in-flight inference task.
 * The worker will discard the result; the promise rejects with TASK_CANCELLED.
 */
export function cancelTask(taskId: string): void {
  const task = _pending.get(taskId);
  if (task) {
    clearTimeout(task.timer);
    _pending.delete(taskId);
    task.reject(new Error('[TASK_CANCELLED] Task was cancelled'));
  }
  send({ type: 'CANCEL_TASK', taskId });
}

/**
 * Request current worker status (async — resolves on next STATUS message).
 */
export function getStatus(): Promise<StatusMessage> {
  return new Promise<StatusMessage>((resolve) => {
    const handler = (msg: StatusMessage) => {
      _statusListeners.delete(handler);
      resolve(msg);
    };
    _statusListeners.add(handler);
    send({ type: 'GET_STATUS' });
  });
}

/**
 * Subscribe to model-load and inference progress events.
 * Returns an unsubscribe function.
 */
export function onProgress(fn: (msg: ProgressMessage) => void): () => void {
  _progressListeners.add(fn);
  return () => _progressListeners.delete(fn);
}

/**
 * Terminate the worker and reset all state.
 * Call this on app unmount or when you want to free memory.
 */
export function destroyWorker(): void {
  rejectAll(new Error('[WORKER_CRASH] Worker destroyed'));
  _worker?.terminate();
  _worker      = null;
  _modelReady  = false;
  _initPromise = null;
}

/** True if the model is loaded and ready for inference. */
export function isModelReady(): boolean {
  return _modelReady;
}
