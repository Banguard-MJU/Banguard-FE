const CACHE_NAME = "banguard-shell-v4";
const APP_SHELL = [
  "/manifest.webmanifest?v=banggadi-original-20260603",
  "/favicon.ico?v=banggadi-original-20260603",
  "/favicon.svg?v=banggadi-original-20260603",
  "/apple-touch-icon.png?v=banggadi-original-20260603",
  "/icons/banguard-icon.svg?v=banggadi-original-20260603",
  "/icons/banguard-icon-192.png?v=banggadi-original-20260603",
  "/icons/banguard-icon-512.png?v=banggadi-original-20260603",
];

const FRESH_ASSET_PATHS = new Set([
  "/manifest.webmanifest",
  "/favicon.ico",
  "/favicon.svg",
  "/apple-touch-icon.png",
  "/icons/banguard-icon.svg",
  "/icons/banguard-icon-192.png",
  "/icons/banguard-icon-512.png",
]);

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(event.request.url);

  if (requestUrl.origin !== self.location.origin || requestUrl.pathname.startsWith("/api")) {
    return;
  }

  if (FRESH_ASSET_PATHS.has(requestUrl.pathname)) {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match(event.request).then((cached) => cached || caches.match(requestUrl.pathname)),
      ),
    );
    return;
  }

  // Network-first for HTML navigations — avoids serving stale HTML that
  // references hashed assets from a previous deploy.
  if (event.request.mode === "navigate" || event.request.destination === "document") {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match(event.request).then((cached) => cached || caches.match("/manifest.webmanifest")),
      ),
    );
    return;
  }

  // Cache-first for static assets (hashed filenames are safe to cache).
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(event.request).then((response) => {
        if (response && response.status === 200 && response.type === "basic") {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return response;
      });
    }),
  );
});
