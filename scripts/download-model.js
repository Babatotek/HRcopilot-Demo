#!/usr/bin/env node
/**
 * scripts/download-model.js
 *
 * Downloads the Kokoro-82M ONNX model and voice files into
 * public/models/kokoro/ so the app can serve them locally
 * without fetching from HuggingFace CDN on every page load.
 *
 * Run once after cloning:
 *   node scripts/download-model.js
 *
 * Files downloaded:
 *   public/models/kokoro/config.json
 *   public/models/kokoro/tokenizer.json
 *   public/models/kokoro/tokenizer_config.json
 *   public/models/kokoro/onnx/model_quantized.onnx  (~88 MB)
 *   public/models/kokoro/voices/*.bin               (54 × 510 KB)
 */

import { existsSync, mkdirSync, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'models', 'onnx-community', 'Kokoro-82M-ONNX');

const HF_BASE    = 'https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX/resolve/main';
const VOICE_BASE = 'https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX/resolve/main/voices';

const MODEL_FILES = [
  { url: `${HF_BASE}/config.json`,            dest: 'config.json' },
  { url: `${HF_BASE}/tokenizer.json`,         dest: 'tokenizer.json' },
  { url: `${HF_BASE}/tokenizer_config.json`,  dest: 'tokenizer_config.json' },
  { url: `${HF_BASE}/onnx/model_quantized.onnx`, dest: 'onnx/model_quantized.onnx' },
];

const VOICES = [
  'af_heart','af_bella','af_nicole','af_sarah','af_sky',
  'am_adam','am_michael','bf_emma','bm_george',
];

async function download(url, destRel) {
  const dest = path.join(OUT, destRel);
  if (existsSync(dest)) {
    console.log(`  ✓ already exists: ${destRel}`);
    return;
  }
  mkdirSync(path.dirname(dest), { recursive: true });
  console.log(`  ↓ downloading: ${destRel}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  await pipeline(res.body, createWriteStream(dest));
}

console.log('Downloading Kokoro model files to public/models/kokoro/...\n');

for (const f of MODEL_FILES) {
  await download(f.url, f.dest);
}

for (const v of VOICES) {
  await download(`${VOICE_BASE}/${v}.bin`, `voices/${v}.bin`);
}

console.log('\n✅ Done. Model files ready at public/models/kokoro/');
