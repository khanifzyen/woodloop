// WoodLoop Service Worker — Network first, cache fallback
const CACHE_NAME = "woodloop-v1";
const API_CACHE = "woodloop-api-v1";
const STATIC_URLS = ["/", "/offline", "/buyer/marketplace"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Clean old caches
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME && k !== API_CACHE)
          .map((k) => caches.delete(k))
      )
    ).then(() => clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API calls — network only, no caching
  if (url.pathname.startsWith("/api/")) {
    return;
  }

  // Next.js static assets (_next/static) — cache first
  if (url.pathname.startsWith("/_next/static")) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request).then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        return response;
      }))
    );
    return;
  }

  // Images (PocketBase, etc.) — cache first, network update
  if (request.destination === "image") {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request).then((response) => {
          caches.open(API_CACHE).then((cache) => cache.put(request, response.clone()));
          return response;
        });
        return cached || fetchPromise;
      })
    );
    return;
  }

  // Navigation — network first, cache fallback, offline page fallback
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match("/offline"))
        )
    );
    return;
  }

  // Other static assets — cache first
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});
