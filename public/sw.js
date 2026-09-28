// Service Worker for Easy Bill Generator PWA
const CACHE_NAME = 'easybill-v1.0';

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/auth.html',
  '/auth.css',
  '/auth.js',
  '/dashboard.html',
  '/bills.html',
  '/bills.css',
  '/bills.js',
  '/bill-templates.js',
  '/stock.html',
  '/stock.css',
  '/stock.js',
  '/customers.html',
  '/customers.css',
  '/customers.js',
  '/owner.html',
  '/admin.html',
  '/profile.html',
  '/panels.css',
  '/sidebar.js',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('Pre-cache partial fallback:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Ignore non-GET requests or Firebase API calls
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin.includes('firestore.googleapis.com') || url.origin.includes('identitytoolkit')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch fresh copy in background (stale-while-revalidate)
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        if (event.request.headers.get('accept')?.includes('text/html')) {
          return caches.match('/dashboard.html') || caches.match('/auth.html');
        }
      });
    })
  );
});
