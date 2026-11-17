const CACHE_NAME = 'manage-core-v2';
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-48.png',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Bypass cache completely for local development, hot reloading, or Vite dependencies
  if (
    url.hostname === 'localhost' ||
    url.hostname === '127.0.0.1' ||
    url.port === '8061' ||
    url.pathname.includes('/@vite/') ||
    url.pathname.includes('/node_modules/')
  ) {
    return;
  }

  if (request.method !== 'GET') {
    return;
  }

  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() => new Response(JSON.stringify({
        message: 'You are offline. Live data will refresh when your connection returns.'
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }))
    );
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put('/index.html', copy));
          return response;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request)
        .then((response) => {
          if (response && response.ok && ['style', 'script', 'image', 'font'].includes(request.destination) && request.url.startsWith('http')) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              if (cache) cache.put(request, copy);
            }).catch(() => {});
          }
          return response;
        })
        .catch(() => cached || new Response('', { status: 408 }));

      return cached || networkFetch;
    }).catch(() => {})
  );
});
