// LawnNotifier — Service Worker v10
// IMPORTANT : changer CACHE_VERSION force le remplacement de l'ancien cache

const CACHE_VERSION = 'lawnnotifier-v11';
const BASE = self.registration.scope;

const ASSETS = [
  BASE,
  BASE + 'index.html',
  BASE + 'manifest.json',
  BASE + 'icon-192.png',
  BASE + 'icon-512.png',
  BASE + 'icon-180.png',
];

// ── Install : mise en cache des assets ──
self.addEventListener('install', event => {
  console.log('[SW] Install v11');
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache =>
      Promise.allSettled(ASSETS.map(url => cache.add(url)))
    )
  );
  // Activation immédiate sans attendre la fermeture des onglets
  self.skipWaiting();
});

// ── Activate : suppression FORCÉE de tous les vieux caches ──
self.addEventListener('activate', event => {
  console.log('[SW] Activate v11 — nettoyage des anciens caches');
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(k => k !== CACHE_VERSION) // garder seulement la version courante
          .map(k => {
            console.log('[SW] Suppression cache:', k);
            return caches.delete(k);
          })
      );
    }).then(() => {
      // Prendre le contrôle de tous les onglets ouverts immédiatement
      return self.clients.claim();
    })
  );
});

// ── Fetch : network-first pour HTML, cache-first pour assets ──
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = event.request.url;

  // Ne jamais mettre en cache les APIs externes
  if (url.includes('api.anthropic.com')   ||
      url.includes('open-meteo.com')       ||
      url.includes('nominatim.openstreetmap.org')) return;

  // Pour index.html : network-first pour toujours avoir la dernière version
  if (url.endsWith('/') || url.endsWith('/index.html') ||
      url === BASE || url === BASE + 'index.html') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_VERSION).then(c => c.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request)
          .then(r => r || caches.match(BASE + 'index.html'))
        )
    );
    return;
  }

  // Pour les autres assets : cache-first
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response.ok && url.startsWith(self.location.origin)) {
          const clone = response.clone();
          caches.open(CACHE_VERSION).then(c => c.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        if (event.request.destination === 'document')
          return caches.match(BASE + 'index.html');
        return new Response('', { status: 503 });
      });
    })
  );
});

// ── Notification click ──
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      const existing = list.find(c => c.url.startsWith(BASE));
      if (existing) return existing.focus();
      return clients.openWindow(BASE);
    })
  );
});

// ── Push ──
self.addEventListener('push', event => {
  let data = { title: '🌿 LawnNotifier', body: 'Rappel de tonte' };
  try { if (event.data) data = event.data.json(); } catch(e) {}
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body:  data.body,
      tag:   data.tag || 'lawnnotifier',
      icon:  BASE + 'icon-192.png',
      badge: BASE + 'icon-192.png',
    })
  );
});
