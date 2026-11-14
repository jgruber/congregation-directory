// Bump VERSION with every release. The browser compares sw.js byte for byte, so
// a new version installs in the background, precaches the new files, and waits
// until the user taps Reload on the page's "Update available" banner.
const VERSION = 'v5';
const CACHE = `cong-dir-${VERSION}`;

// This site's files the app needs to start with no network. index.html is also
// kept fresh at runtime (network-first); the rest only changes with VERSION.
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './favicon.svg',
  './favicon.ico',
  './favicon-16x16.png',
  './favicon-32x32.png',
  './apple-touch-icon.png',
  './favicon-512x512.png',
];

// Libraries index.html loads from CDNs, downloaded on each device at install so
// they work offline. URLs must match index.html exactly (pinned versions), and
// mode must match how the page requests them: 'cors' for tags with crossorigin
// (and sql.js's own fetch of the .wasm), 'no-cors' for Tailwind, whose CDN sends
// no CORS headers - its cached copy is opaque, which a <script> tag can still run.
const CDN_ASSETS = [
  { url: 'https://cdn.tailwindcss.com/3.4.17', mode: 'no-cors' },
  { url: 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/sql-wasm.js', mode: 'cors' },
  { url: 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/sql-wasm.wasm', mode: 'cors' },
  { url: 'https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js', mode: 'cors' },
  { url: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css', mode: 'cors' },
  { url: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', mode: 'cors' },
  { url: 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js', mode: 'cors' },
];
const CDN_URLS = new Set(CDN_ASSETS.map(a => a.url));

// How long a navigation waits for the network before using the cached page
const NAVIGATION_TIMEOUT_MS = 3000;

self.addEventListener('install', e => {
  // cache: 'reload' skips the HTTP cache, so a release never precaches a stale copy.
  // If anything fails (e.g. a CDN is down) the install fails and the current
  // version keeps running; the browser tries again on a later launch.
  e.waitUntil(caches.open(CACHE).then(cache => Promise.all([
    cache.addAll(APP_SHELL.map(url => new Request(url, { cache: 'reload' }))),
    // Not addAll: it rejects opaque (no-cors) responses
    ...CDN_ASSETS.map(async ({ url, mode }) => {
      const response = await fetch(new Request(url, { mode, credentials: 'omit' }));
      if (!response.ok && response.type !== 'opaque') throw new Error(`${url}: HTTP ${response.status}`);
      await cache.put(url, response);
    }),
  ])));
});

self.addEventListener('activate', e => {
  // Delete caches from previous versions
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Sent by the page's Reload button
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  if (e.request.method !== 'GET') return;

  // Precached CDN libraries
  if (CDN_URLS.has(e.request.url)) {
    e.respondWith(caches.match(e.request.url).then(cached => cached || fetch(e.request)));
    return;
  }

  // Otherwise only this site's own files. The CSV server, Google APIs, map
  // tiles and geocoding always go straight to the network.
  if (url.origin !== self.location.origin) return;

  if (e.request.mode === 'navigate') {
    e.respondWith(navigate(e, url));
    return;
  }

  // Cache-first for static files
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});

// Network-first for pages, falling back to the cache when the network fails or
// is slower than NAVIGATION_TIMEOUT_MS. A late network response still refreshes
// the cache for next time.
async function navigate(e, url) {
  const cache = await caches.open(CACHE);
  // The app is one page; any query string (e.g. ?pid=) is the same document
  const isApp = url.pathname.endsWith('/') || url.pathname.endsWith('/index.html');
  const cacheKey = isApp ? './index.html' : e.request;

  const network = fetch(e.request).then(response => {
    if (response.ok) cache.put(cacheKey, response.clone());
    return response;
  });
  e.waitUntil(network.catch(() => {}));

  const timeout = new Promise(resolve => setTimeout(resolve, NAVIGATION_TIMEOUT_MS));
  try {
    const response = await Promise.race([network, timeout]);
    if (response) return response;
  } catch (_) { /* offline: fall through to the cache */ }

  const cached = await cache.match(cacheKey, { ignoreSearch: true });
  // Nothing cached yet (e.g. home.html never visited): keep waiting on the network
  return cached || network;
}
