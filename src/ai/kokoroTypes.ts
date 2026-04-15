// ============================================
// FILE: src/ai/kokoroTypes.ts
// PURPOSE: Canonical message protocol types for the Kokoro Worker Architecture.
//          Used by kokoroClient.ts, inferenceEngine.ts, and the worker itself.
// ============================================

// ── Inbound messages (main thread → worker) ────────────────────────────────────

export type WorkerInboundType =
  | 'INIT_MODEL'
  | 'RUN_INFERENCE'
  | 'CANCEL_TASK'
  | 'GET_STATUS';

export interface InitModelMessage {
  type:    'INIT_MODEL';
  modelId: string;
}

export interface RunInferenceMessage {
  type:   'RUN_INFERENCE';
  taskId: string;
  text:   string;
  voice:  string;
  speed:  number;
}

export interface CancelTaskMessage {
  type:   'CANCEL_TASK';
  taskId: string;
}

export interface GetStatusMessage {
  type: 'GET_STATUS';
}

export type WorkerInboundMessage =
  | InitModelMessage
  | RunInferenceMessage
  | CancelTaskMessage
  | GetStatusMessage;

// ── Outbound messages (worker → main thread) ──────────────────────────────────

export type WorkerOutboundType =
  | 'RESULT'
  | 'ERROR'
  | 'PROGRESS'
  | 'STATUS';

export interface ResultMessage {
  type:       'RESULT';
  taskId:     string;
  pcm:        Float32Array;
  sampleRate: number;
  durationMs: number;
}

export interface ErrorMessage {
  type:    'ERROR';
  taskId?: string;
  code:    WorkerErrorCode;
  message: string;
}

export interface ProgressMessage {
  type:    'PROGRESS';
  phase:   'model-load' | 'inference';
  taskId?: string;
  pct:     number;
  label:   string;
}

export interface StatusMessage {
  type:        'STATUS';
  modelLoaded: boolean;
  busy:        boolean;
  queueDepth:  number;
}

export type WorkerOutboundMessage =
  | ResultMessage
  | ErrorMessage
  | ProgressMessage
  | StatusMessage;

// ── Error codes ────────────────────────────────────────────────────────────────

export type WorkerErrorCode =
  | 'MODEL_LOAD_FAILED'
  | 'INFERENCE_FAILED'
  | 'MODEL_NOT_LOADED'
  | 'TASK_CANCELLED'
  | 'WORKER_CRASH'
  | 'TIMEOUT';

// ── Public API types (used by useKokoro hook) ──────────────────────────────────

export interface InferenceRequest {
  text:   string;
  voice?: string;
  speed?: number;
}

export interface InferenceResult {
  taskId:     string;
  pcm:        Float32Array;
  sampleRate: number;
  durationMs: number;
}

export type KokoroStatus =
  | 'idle'
  | 'loading'
  | 'ready'
  | 'generating'
  | 'error';

export interface KokoroState {
  status:   KokoroStatus;
  progress: number;       // 0–100
  error:    string | null;
}
