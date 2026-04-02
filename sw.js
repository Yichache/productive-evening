const CACHE_NAME = 'evening-portal-v2';
const ASSETS = ['./', './index.html', './manifest.json', './content.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Network-first for API calls, cache-first for assets
  if (e.request.url.includes('workers.dev')) return;

  // Handle requests without trailing slash (e.g. /productive-evening)
  const url = new URL(e.request.url);
  if (url.pathname === '/productive-evening') {
    e.respondWith(Response.redirect('/productive-evening/', 301));
    return;
  }

  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
