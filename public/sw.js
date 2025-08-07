const CACHE_NAME = 'flexio-v3';
const CRITICAL_RESOURCES = [
  '/',
  '/index.html',
  '/lovable-uploads/801f0a89-558e-4fd0-8e4e-102d5c5d2d3e.png' // Logo
];

const RUNTIME_CACHE = 'flexio-runtime-v3';

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching critical resources');
        return cache.addAll(CRITICAL_RESOURCES);
      })
      .then(() => {
        self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      self.clients.claim();
    })
  );
});

// Fetch event - implement caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }

  // Handle navigation requests (HTML pages) with network-first to avoid stale HTML
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful navigation responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE)
              .then((cache) => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(async () => {
          // Fallback to cache if offline
          return (await caches.match(request)) || (await caches.match('/index.html')) || Response.error();
        })
    );
    return;
  }

  // For JS and CSS, bypass cache to prevent stale chunks
  if (request.destination === 'script' || request.destination === 'style') {
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
    return;
  }

  // Cache-first for images
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) return response;
        return fetch(request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // For API requests, use network-first strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE)
              .then((cache) => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
    return;
  }
});

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle any offline actions here
      console.log('Background sync triggered')
    );
  }
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'cache-cleanup') {
    event.waitUntil(
      // Clean up old cache entries
      cleanupCache()
    );
  }
});

async function cleanupCache() {
  const caches_list = await caches.keys();
  const oldCaches = caches_list.filter(name => name.startsWith('flexio-') && name !== CACHE_NAME && name !== RUNTIME_CACHE);
  
  await Promise.all(
    oldCaches.map(cacheName => caches.delete(cacheName))
  );
}