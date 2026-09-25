const CACHE_NAME = 'comm-radio-v1';

// Automatically clear prior caches on activation
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Network-first strategy to prevent stale caches during live broadcasts
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('google.com') || event.request.url.includes('googleusercontent.com')) {
    return; // Pass through audio streams & Google backend directly
  }
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});