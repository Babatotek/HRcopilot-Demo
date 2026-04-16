/**
 * scripts/pregenerate-narration.mjs
 *
 * Pre-generates all narration audio files and saves them to
 * public/audio/narration/<scriptId>.<role>.mp3
 *
 * Run once locally, commit the files, and they'll be served from CDN
 * on Netlify — zero API calls, zero browser dependency at runtime.
 *
 * Usage:
 *   node scripts/pregenerate-narration.mjs
 *
 * Env vars read from .env.local:
 *   VITE_ELEVENLABS_API_KEY   — ElevenLabs API key
 *   VITE_ELEVENLABS_VOICE_ID  — Voice ID to use
 *   VITE_GROQ_API_KEY         — Groq API key (fallback if ElevenLabs fails)
 *
 * Options (env vars):
 *   PROVIDER=groq             — Force Groq TTS instead of ElevenLabs
 *   GROQ_VOICE=autumn         — Groq voice name (default: autumn)
 *   SKIP_EXISTING=true        — Skip files that already exist (default: true)
 *   CONCURRENCY=3             — Parallel requests (default: 3)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, '..');

// ── Load .env.local ────────────────────────────────────────────────────────────
function loadEnv() {
  const envPath = path.join(ROOT, '.env.local');
  if (!fs.existsSync(envPath)) {
    console.warn('[pregenerate] .env.local not found — using process.env');
    return;
  }
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}
loadEnv();

// ── Config ─────────────────────────────────────────────────────────────────────
const ELEVENLABS_KEY      = process.env.VITE_ELEVENLABS_API_KEY  ?? '';
const ELEVENLABS_VOICE_ID = process.env.VITE_ELEVENLABS_VOICE_ID ?? '';
const GROQ_KEY            = process.env.VITE_GROQ_API_KEY        ?? '';
const PROVIDER            = process.env.PROVIDER === 'groq' ? 'groq' : 'elevenlabs';
const GROQ_VOICE          = process.env.GROQ_VOICE ?? 'autumn';
const SKIP_EXISTING       = process.env.SKIP_EXISTING !== 'false';
const CONCURRENCY         = parseInt(process.env.CONCURRENCY ?? '3', 10);
const OUT_DIR             = path.join(ROOT, 'public', 'audio', 'narration');

// ── All scripts (mirrors src/demo/voice/scripts/index.ts) ─────────────────────
// We import the compiled version via a dynamic require of the TS source
// transpiled on-the-fly, OR we just inline the keys here to avoid a build step.
// We inline the keys — the texts are resolved at runtime from the same source.

// Load ALL_SCRIPTS by reading the TS file and eval-ing the object
// (safe — it's our own source file with no side effects)
function loadAllScripts() {
  const tsPath = path.join(ROOT, 'src', 'demo', 'voice', 'scripts', 'index.ts');
  let src = fs.readFileSync(tsPath, 'utf8');
  // Strip TS export keyword and type annotations so we can eval it
  src = src
    .replace(/^export\s+const\s+ALL_SCRIPTS[^=]+=\s*/m, 'const ALL_SCRIPTS = ')
    .replace(/:\s*Record<string,\s*any>/g, '')
    .replace(/^export\s+/gm, '');
  // Wrap in a function and return
  const fn = new Function(`${src}; return ALL_SCRIPTS;`);
  return fn();
}

const ALL_SCRIPTS = loadAllScripts();

// ── Build the work list ────────────────────────────────────────────────────────
const ROLES = ['CEO', 'HR', 'FINANCE'];

function buildWorkList() {
  const items = [];
  for (const [scriptId, entry] of Object.entries(ALL_SCRIPTS)) {
    if (typeof entry === 'string') {
      // Single-role script (e.g. 'closing.ceo')
      const role = scriptId.includes('.ceo') ? 'CEO'
                 : scriptId.includes('.hr')  ? 'HR'
                 : scriptId.includes('.finance') ? 'FINANCE'
                 : 'CEO';
      items.push({ scriptId, role, text: entry });
    } else if (typeof entry === 'object' && entry !== null) {
      for (const role of ROLES) {
        const text = entry[role];
        if (text && typeof text === 'string') {
          items.push({ scriptId, role, text });
        }
      }
    }
  }
  return items;
}

// ── File naming ────────────────────────────────────────────────────────────────
function outFilename(scriptId, role, ext) {
  // Replace dots and slashes in scriptId with dashes for safe filenames
  const safe = scriptId.replace(/[^a-zA-Z0-9_-]/g, '-');
  return path.join(OUT_DIR, `${safe}.${role}.${ext}`);
}

// ── TTS providers ──────────────────────────────────────────────────────────────
async function generateElevenLabs(text) {
  if (!ELEVENLABS_KEY || !ELEVENLABS_VOICE_ID) {
    throw new Error('VITE_ELEVENLABS_API_KEY and VITE_ELEVENLABS_VOICE_ID must be set');
  }
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}/stream`,
    {
      method:  'POST',
      headers: {
        'xi-api-key':   ELEVENLABS_KEY,
        'Content-Type': 'application/json',
        Accept:         'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        model_id:       'eleven_turbo_v2_5',
        voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.0, use_speaker_boost: true },
      }),
    },
  );
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`ElevenLabs ${res.status}: ${body}`);
  }
  return { buffer: Buffer.from(await res.arrayBuffer()), ext: 'mp3' };
}

async function generateGroq(text) {
  if (!GROQ_KEY) throw new Error('VITE_GROQ_API_KEY must be set');
  const res = await fetch('https://api.groq.com/openai/v1/audio/speech', {
    method:  'POST',
    headers: { Authorization: `Bearer ${GROQ_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model:           'canopylabs/orpheus-v1-english',
      input:           text,
      voice:           GROQ_VOICE,
      response_format: 'wav',
    }),
  });
  if (!res.ok) throw new Error(`Groq TTS ${res.status}: ${res.statusText}`);
  return { buffer: Buffer.from(await res.arrayBuffer()), ext: 'wav' };
}

// ── Concurrency pool ───────────────────────────────────────────────────────────
async function runWithConcurrency(items, fn, limit) {
  const results = [];
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx  = i++;
      const item = items[idx];
      results[idx] = await fn(item, idx, items.length);
    }
  }
  await Promise.all(Array.from({ length: limit }, worker));
  return results;
}

// ── Main ───────────────────────────────────────────────────────────────────────
async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const workList = buildWorkList();
  console.log(`[pregenerate] ${workList.length} narration lines to generate`);
  console.log(`[pregenerate] Provider: ${PROVIDER} | Concurrency: ${CONCURRENCY} | Skip existing: ${SKIP_EXISTING}`);
  console.log(`[pregenerate] Output: ${OUT_DIR}\n`);

  let done = 0, skipped = 0, failed = 0;

  await runWithConcurrency(workList, async ({ scriptId, role, text }, idx, total) => {
    const ext      = PROVIDER === 'groq' ? 'wav' : 'mp3';
    const filePath = outFilename(scriptId, role, ext);

    if (SKIP_EXISTING && fs.existsSync(filePath)) {
      skipped++;
      process.stdout.write(`\r[pregenerate] ${idx + 1}/${total} — skipped ${skipped}, done ${done}, failed ${failed}   `);
      return;
    }

    try {
      const { buffer, ext: actualExt } = PROVIDER === 'groq'
        ? await generateGroq(text)
        : await generateElevenLabs(text);

      const actualPath = outFilename(scriptId, role, actualExt);
      fs.writeFileSync(actualPath, buffer);
      done++;
    } catch (err) {
      failed++;
      console.error(`\n[pregenerate] ✗ ${scriptId}.${role}: ${err.message}`);
    }

    process.stdout.write(`\r[pregenerate] ${idx + 1}/${total} — skipped ${skipped}, done ${done}, failed ${failed}   `);
  }, CONCURRENCY);

  console.log(`\n\n[pregenerate] ✅ Complete — ${done} generated, ${skipped} skipped, ${failed} failed`);
  console.log(`[pregenerate] Files saved to: ${OUT_DIR}`);

  if (done > 0) {
    console.log('\n[pregenerate] Next steps:');
    console.log('  1. git add public/audio/narration/');
    console.log('  2. git commit -m "feat: pre-generated narration audio"');
    console.log('  3. git push  →  Netlify serves files from CDN automatically');
  }
}

main().catch((err) => {
  console.error('[pregenerate] Fatal:', err);
  process.exit(1);
});
