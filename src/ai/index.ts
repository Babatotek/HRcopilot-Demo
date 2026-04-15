// ============================================
// FILE: src/ai/index.ts
// PURPOSE: Public API surface for the Kokoro Worker Architecture.
//
//   Import from here in application code:
//     import { enqueue, warmUp } from '../ai';
//     import { useKokoro } from '../hooks/useKokoro';
// ============================================

// Types
export type {
  InferenceRequest,
  InferenceResult,
  KokoroState,
  KokoroStatus,
  WorkerErrorCode,
} from './kokoroTypes';

// Client (low-level worker bridge)
export {
  initModel,
  runInference,
  cancelTask,
  getStatus,
  onProgress,
  destroyWorker,
  isModelReady,
} from './kokoroClient';

// Inference engine (queue + cache)
export {
  enqueue,
  warmUp,
  getQueueDepth,
} from './inferenceEngine';
