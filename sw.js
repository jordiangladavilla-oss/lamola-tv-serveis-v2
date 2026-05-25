// Service Worker V2 — cache-first shell, network-first JSON data.

const VERSION = 'v2-2';
const SHELL = `lamola-tv-shell-${VERSION}`;
const DATA = `lamola-tv-data-${VERSION}`;

const SHELL_ASSETS = [
  './',
  './index.html',
  './css/tokens.css',
  './css/tv.css',
  './js/tv/main.js',
  './js/tv/carousel.js',
  './js/tv/data-loader.js',
  './js/tv/clock.js',
  './js/tv/qr.js',
  './js/tv/slide-intro.js',
  './js/tv/slide-pro-intro.js',
  './js/tv/slide-pro.js',
  './js/tv/slide-merch.js',
  './js/tv/vendor/qrcode.min.js',
  './fonts/montserrat-latin-400-normal.woff2',
  './fonts/montserrat-latin-500-normal.woff2',
  './fonts/montserrat-latin-500-italic.woff2',
  './fonts/montserrat-latin-600-normal.woff2',
  './fonts/montserrat-latin-800-normal.woff2',
  './fonts/instrument-serif-latin-400-normal.woff2',
  './fonts/instrument-serif-latin-400-italic.woff2',
  './fonts/jetbrains-mono-latin-400-normal.woff2',
  './fonts/jetbrains-mono-latin-500-normal.woff2',
  './media/brand/logo-short.png',
  './manifest.webmanifest'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(SHELL).then(c => c.addAll(SHELL_ASSETS).catch(err => console.warn('[sw] precache partial', err)))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== SHELL && k !== DATA).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

// Media URLs we never cache (browsers send Range requests, response is 206 → not cacheable)
function isUncacheableMedia(url) {
  return /\.(mp4|webm|mov|m4v)$/i.test(url.pathname);
}
function isCacheableResponse(res) {
  // Only full 200 OK basic responses can be cached safely. Skip 206 (partial), opaque, redirects.
  return res && res.ok && res.status === 200 && res.type === 'basic';
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Skip SW entirely for media that uses Range requests
  if (isUncacheableMedia(url)) return;

  const isData = url.pathname.endsWith('/services.json') || url.pathname.endsWith('/config.json');

  if (isData) {
    e.respondWith(
      fetch(req).then(res => {
        if (isCacheableResponse(res)) {
          const copy = res.clone();
          caches.open(DATA).then(c => c.put(req, copy)).catch(() => {});
        }
        return res;
      }).catch(() => caches.match(req).then(r => r || new Response('{}', { headers: { 'Content-Type': 'application/json' } })))
    );
  } else {
    e.respondWith(
      caches.match(req).then(cached => {
        if (cached) {
          fetch(req).then(res => {
            if (isCacheableResponse(res)) {
              const copy = res.clone();
              caches.open(SHELL).then(c => c.put(req, copy)).catch(() => {});
            }
          }).catch(() => {});
          return cached;
        }
        return fetch(req).then(res => {
          if (isCacheableResponse(res)) {
            const copy = res.clone();
            caches.open(SHELL).then(c => c.put(req, copy)).catch(() => {});
          }
          return res;
        });
      })
    );
  }
});
