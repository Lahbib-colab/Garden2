const CACHE = 'lawnnotifier-v9';
const ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './icon-180.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // Never cache external APIs
  const url = e.request.url;
  if (url.includes('api.anthropic.com') ||
      url.includes('open-meteo.com') ||
      url.includes('nominatim.openstreetmap.org')) return;
  e.respondWith(
    caches.match(e.request).then(r =>
      r || fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }).catch(() =>
        e.request.destination === 'document'
          ? caches.match('./index.html')
          : new Response('', { status: 503 })
      )
    )
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow('./'));
});
