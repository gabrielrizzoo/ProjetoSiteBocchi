const CACHE_NAME = 'bocchi-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/contato.html',
  '/fotos.html',
  '/comentarios.html',
  '/filme.html',
  '/global.css',
  '/styles.css',
  '/contato.css',
  '/fotos.css',
  '/comentarios.css',
  '/filme.css',
  '/script.js',
  '/contato.js',
  '/fotos.js',
  '/comentarios.js',
  '/filme.js',
  '/assets/images/favicon.svg',
  '/assets/images/Logo Bocchi 2.png',
  '/assets/images/Logo Bocchi.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
  self.skipWaiting();
});

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

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          (response) => {
            // Don't cache if not a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response because it's a stream
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                // We only cache requests from http/https, not chrome-extension:// etc
                if (event.request.url.startsWith('http')) {
                  cache.put(event.request, responseToCache);
                }
              });

            return response;
          }
        );
      })
  );
});
