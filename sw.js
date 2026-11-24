const CACHE_NAME = 'bio-cache-v2';   // naik dari v1 supaya cache lama terganti
const urlsToCache = ['index.html', 'manifest.json'];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Hapus cache versi lama
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;

  // Biarkan request non-GET dan request ke domain lain (Google/GAS) ditangani browser
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return;

  // Utamakan jaringan, cache hanya cadangan saat offline
  event.respondWith(
    fetch(req)
      .then(res => {
        const salinan = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, salinan));
        return res;
      })
      .catch(() => caches.match(req))
  );
});
