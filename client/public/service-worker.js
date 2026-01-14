/**
 * Service Worker for BudgetBuddy
 * Enables offline support and app installation
 */

const CACHE_NAME = 'budgetbuddy-v2';
const API_CACHE = 'budgetbuddy-api-v2';
const TIMEOUT = 8000; // 8 second timeout for network requests

const urlsToCache = [
  '/',
  '/index.html',
  '/static/css/main.css',
  '/static/js/main.js',
  '/logo_icon.png',
  '/manifest.json'
];

// Timeout helper for fetch requests
function fetchWithTimeout(request, timeout = TIMEOUT) {
  return Promise.race([
    fetch(request),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Network timeout')), timeout)
    )
  ]);
}

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch(() => {
        console.log('Some assets failed to cache during install');
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean old caches and update version
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Remove old cache versions
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network with timeout
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  const { request } = event;
  const url = new URL(request.url);

  // API requests - network first with timeout, fallback to cache
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetchWithTimeout(request)
        .then((response) => {
          // Only cache successful responses
          if (!response || response.status !== 200) {
            return response;
          }

          const responseClone = response.clone();
          // Cache API responses with timestamp
          caches.open(API_CACHE).then((cache) => {
            const cacheResponse = responseClone.clone();
            // Store with metadata for expiration
            cache.put(
              request.url,
              new Response(cacheResponse.body, {
                status: cacheResponse.status,
                statusText: cacheResponse.statusText,
                headers: new Headers(cacheResponse.headers)
              })
            );
          });
          return responseClone;
        })
        .catch((error) => {
          console.log('Network request failed, trying cache:', request.url, error);
          // Network failed, return cached version
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Return offline data message
            return new Response(
              JSON.stringify({ offline: true, message: 'Data cached offline' }),
              {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
              }
            );
          });
        })
    );
  } else {
    // Static assets - cache first, fallback to network with timeout
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          // Return cached asset immediately
          return response;
        }

        // Not in cache, try network with timeout
        return fetchWithTimeout(request)
          .then((response) => {
            // Validate response
            if (!response || response.status !== 200 || response.type === 'error') {
              return response;
            }

            // Cache successful response
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
            return response;
          })
          .catch((error) => {
            console.log('Failed to fetch asset:', request.url, error);
            // Return offline fallback page for HTML requests
            if (request.mode === 'navigate' || request.headers.get('accept').includes('text/html')) {
              return caches.match('/index.html').catch(() => {
                return new Response(
                  '<h1>Offline</h1><p>The app is not available offline. Check your connection.</p>',
                  { headers: { 'Content-Type': 'text/html' } }
                );
              });
            }
            // For other assets, return error response
            return new Response('Asset not available', { status: 503 });
          });
      })
    );
  }
});

// Handle messages from app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
