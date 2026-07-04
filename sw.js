const CACHE_NAME = 'bio-cache-v1';
const urlsToCache = ['index.html', 'manifest.json'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  // PENTING: skip request selain GET (misal POST laporan CSP dari
  // Google), dan skip request cross-origin -- service worker cuma
  // perlu ikut campur buat asset situs sendiri (index.html/manifest),
  // bukan semua traffic yang lewat.
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
