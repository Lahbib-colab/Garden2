// LawnNotifier — Service Worker v9
// Compatible GitHub Pages sous-dossier (ex: /Garden2/)

const CACHE = 'lawnnotifier-v9';

// Détermine le scope dynamiquement (fonctionne avec /Garden2/ ou /)
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
  event.waitUntil(
    caches.open(CACHE).then(cache =>
      // addAll échoue si un asset manque — on utilise add individuel pour être tolérant
      Promise.allSettled(ASSETS.map(url => cache.add(url)))
    )
  );
  self.skipWaiting(); // active immédiatement sans attendre la fermeture des onglets
});

// ── Activate : suppression des vieux caches ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE)
          .map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim(); // contrôle immédiat de tous les onglets ouverts
});

// ── Fetch : stratégie cache-first pour assets, network-only pour APIs ──
self.addEventListener('fetch', event => {
  if(event.request.method !== 'GET') return;

  const url = event.request.url;

  // Ne jamais mettre en cache les appels API externes
  if(url.includes('api.anthropic.com')  ||
     url.includes('open-meteo.com')     ||
     url.includes('nominatim.openstreetmap.org')) {
    return; // laisse le navigateur gérer directement
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if(cached) return cached;
      return fetch(event.request).then(response => {
        // Mettre en cache les nouvelles ressources du même domaine
        if(response.ok && url.startsWith(self.location.origin)){
          const clone = response.clone();
          caches.open(CACHE).then(c => c.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // Offline fallback : renvoyer index.html pour les navigations
        if(event.request.destination === 'document'){
          return caches.match(BASE + 'index.html') ||
                 caches.match(BASE);
        }
        return new Response('', { status: 503, statusText: 'Offline' });
      });
    })
  );
});

// ── Notification click ──
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      // Ouvre l'app si déjà ouverte, sinon nouvelle fenêtre
      const existing = list.find(c => c.url.startsWith(BASE));
      if(existing) return existing.focus();
      return clients.openWindow(BASE);
    })
  );
});

// ── Push events (Web Push API) ──
self.addEventListener('push', event => {
  let data = { title: '🌿 LawnNotifier', body: 'Rappel de tonte' };
  try { if(event.data) data = event.data.json(); } catch(e) {}
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body:    data.body,
      tag:     data.tag || 'lawnnotifier',
      icon:    BASE + 'icon-192.png',
      badge:   BASE + 'icon-192.png',
    })
  );
});
