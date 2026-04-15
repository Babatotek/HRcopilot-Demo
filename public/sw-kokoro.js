/**
 * sw-kokoro.js — Service Worker for Kokoro model file interception
 *
 * Intercepts ALL requests to huggingface.co for Kokoro model/voice files
 * and serves them from /models/ instead. This means:
 *   - Zero CDN downloads after the first visit
 *   - Works offline
 *   - No re-download on page refresh
 *
 * Intercepted URL patterns:
 *   https://huggingface.co/onnx-community/Kokoro-82M-*/resolve/main/**
 *   → /models/onnx-community/Kokoro-82M-ONNX/**
 *
 * Voice files (from kokoro-js hardcoded URL):
 *   https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX/resolve/main/voices/*.bin
 *   → /models/onnx-community/Kokoro-82M-ONNX/voices/*.bin
 */

const CACHE_NAME = 'kokoro-model-v1';

// Map HF URL patterns to local paths
function getLocalPath(url) {
  const u = new URL(url);
  if (!u.hostname.includes('huggingface.co')) return null;

  // Match: /onnx-community/Kokoro-82M-*/resolve/main/<rest>
  const m = u.pathname.match(/\/onnx-community\/Kokoro-82M[^/]*\/resolve\/main\/(.+)/);
  if (!m) return null;

  const rest = m[1]; // e.g. "onnx/model_quantized.onnx" or "voices/af_heart.bin"
  return `/models/onnx-community/Kokoro-82M-ONNX/${rest}`;
}

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
  const localPath = getLocalPath(e.request.url);
  if (!localPath) return; // not a Kokoro HF request — pass through

  e.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Check cache first
      const cached = await cache.match(localPath);
      if (cached) return cached;

      // Fetch from local server
      const localReq = new Request(localPath);
      try {
        const res = await fetch(localReq);
        if (res.ok) {
          cache.put(localPath, res.clone()); // cache for next time
          return res;
        }
      } catch { /* fall through to CDN */ }

      // Local file missing — fall back to CDN (first-time setup)
      console.warn(`[SW] Local file not found: ${localPath}, falling back to CDN`);
      return fetch(e.request);
    })
  );
});
