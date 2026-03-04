const CACHE = 'cong-dir-v2';

// App shell files to pre-cache on install
const APP_SHELL = [
  './',
  './favicon.svg',
  './favicon.ico',
  './favicon-16x16.png',
  './favicon-32x32.png',
  './apple-touch-icon.png',
  './favicon-512x512.png',
  './manifest.json',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  // Delete old caches from previous versions
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Always go to network for CSV fetches (authenticated, must be fresh)
  if (e.request.headers.has('authorization') || url.pathname.endsWith('/download')) {
    return;
  }

  // Cache-first for same-origin assets; cache CDN resources on first load
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        if (response.ok && (url.origin === self.location.origin || url.hostname.includes('cdn'))) {
          caches.open(CACHE).then(c => c.put(e.request, response.clone()));
        }
        return response;
      });
    })
  );
});
