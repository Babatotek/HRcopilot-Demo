// ============================================
// FILE: src/demo/voice/kokoroWorker.ts
// PURPOSE: Web Worker for Kokoro TTS — LOCAL MODEL SERVING
//
// Model files are served from /public/models/kokoro/ by Vite,
// so there is NO download on every refresh. The 88MB ONNX file
// loads from the local dev server (or CDN-cached build) in ~1s.
//
// File layout (public/models/kokoro/):
//   config.json
//   tokenizer.json
//   tokenizer_config.json
//   onnx/model_quantized.onnx   (88 MB)
//   voices/*.bin                (54 voices × 510 KB)
// ============================================

import { KokoroTTS, env } from 'kokoro-js';

// ── Point @huggingface/transformers at our local static files ─────────────────
// This prevents ANY fetch to huggingface.co — the model loads from
// the Vite dev server (or deployed origin) instead.
//
// transformers constructs: localModelPath + modelId + filename
// e.g. /models/ + onnx-community/Kokoro-82M-ONNX + /onnx/model_quantized.onnx
// → /models/onnx-community/Kokoro-82M-ONNX/onnx/model_quantized.onnx
// which maps to public/models/onnx-community/Kokoro-82M-ONNX/...
(env as any).localModelPath   = '/models/';
(env as any).allowLocalModels = true;
(env as any).allowRemoteModels = false;  // hard-block CDN — use local only
(env as any).useBrowserCache  = true;    // still cache in Cache API after first load

// ── State ──────────────────────────────────────────────────────────────────────
let tts: KokoroTTS | null = null;

// ── Message handler ────────────────────────────────────────────────────────────
self.onmessage = async (e: MessageEvent) => {
  const { type, modelId, text, voice, speed } = e.data;

  switch (type) {

    case 'load': {
      try {
        const device = 'wasm';
        console.log('[Kokoro-Worker] Loading model from LOCAL: /models/onnx-community/Kokoro-82M-ONNX');

        tts = await KokoroTTS.from_pretrained(modelId, {
          dtype:  'q8',
          device: device as any,
          progress_callback: (info: { status: string; name?: string; progress?: number }) => {
            if (info.status === 'progress' && info.progress !== undefined) {
              self.postMessage({
                type: 'load-progress',
                pct:  Math.round(info.progress),
                file: info.name ?? '',
              });
            }
            if (info.status === 'ready') {
              self.postMessage({ type: 'load-progress', pct: 100, file: 'cached' });
            }
          },
        });

        self.postMessage({ type: 'load-complete', success: true });
      } catch (err) {
        self.postMessage({
          type:    'error',
          message: err instanceof Error ? err.message : String(err),
        });
      }
      break;
    }

    case 'generate': {
      if (!tts) {
        self.postMessage({ type: 'error', message: 'Model not loaded', text, genId: e.data.genId });
        return;
      }

      const { genId } = e.data;

      try {
        const result = await tts.generate(text, { voice, speed });

        // Copy the Float32Array data before transferring the buffer.
        // transfer() neuters the source ArrayBuffer — byteOffset-aware
        // slice creates an independent copy so the view stays valid.
        const srcArray  = result.audio;
        const pcmBuffer = srcArray.buffer.slice(
          srcArray.byteOffset,
          srcArray.byteOffset + srcArray.byteLength
        );

        self.postMessage(
          {
            type:       'generate-complete',
            genId,
            text,
            pcm:        new Float32Array(pcmBuffer),
            sampleRate: result.sampling_rate,   // 24000 Hz
          },
          { transfer: [pcmBuffer] },
        );
      } catch (err) {
        self.postMessage({
          type:    'error',
          message: err instanceof Error ? err.message : String(err),
          genId,
          text,
        });
      }
      break;
    }

    case 'check-cache': {
      try {
        const cache    = await caches.open('transformers-cache');
        const keys     = await cache.keys();
        const hasModel = keys.some((r) => r.url.includes('Kokoro') || r.url.includes('kokoro'));
        self.postMessage({ type: 'cache-status', cached: hasModel, fileCount: keys.length });
      } catch {
        self.postMessage({ type: 'cache-status', cached: false, fileCount: 0 });
      }
      break;
    }
  }
};
