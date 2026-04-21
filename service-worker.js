const CACHE_NAME = 'bocchi-cache-v4';

// Core assets that are pre-cached on install
const CORE_ASSETS = [
  './',
  './index.html',
  './contato.html',
  './fotos.html',
  './comentarios.html',
  './filme.html',
  './global.css',
  './styles.css',
  './contato.css',
  './fotos.css',
  './comentarios.css',
  './filme.css',
  './script.js',
  './contato.js',
  './fotos.js',
  './comentarios.js',
  './filme.js',
  './manifest.json',
  './assets/images/favicon.svg',
  './assets/images/Logo Bocchi 2.png',
  './assets/images/Logo Bocchi.png',
  './assets/images/icon-512.png'
];

// Image assets cached on first access (lazy cache)
const IMAGE_ASSETS = [
  './assets/images/banner-header.jpg',
  './assets/images/banner-contato.jpg',
  './assets/images/card-bocchi.webp',
  './assets/images/card-ryou.jpg',
  './assets/images/card-nijika.jpg',
  './assets/images/card-kita.jpg',
  './assets/images/album-cover.png',
  './assets/images/og-preview.jpg',
  './assets/images/anime1.jpg',
  './assets/images/anime2.jpg',
  './assets/images/anime3.jpg',
  './assets/images/anime4.jpg',
  './assets/images/anime5.jpg',
  './assets/images/anime6.jpg',
  './assets/images/show.jpeg',
  './assets/images/show1.jpg',
  './assets/images/show2.jpg',
  './assets/images/show3.jpg'
];

// Install: Pre-cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: Stale-While-Revalidate strategy
// Serve from cache immediately, then update cache in background
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // Skip non-http(s) requests (chrome-extension, etc.)
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Create a network fetch promise that updates the cache
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          // Only cache valid responses
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Network failed, return cached or offline fallback
          return cachedResponse;
        });

      // Return cached response immediately, or wait for network
      return cachedResponse || fetchPromise;
    })
  );
});
