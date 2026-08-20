/* Cuisenio service worker — network-first navigations (SPA), cache-first static assets */
const CACHE = "cuisenio-shell-v2"
const PRECACHE = ["/", "/index.html", "/manifest.webmanifest", "/pwa-192.png", "/pwa-512.png"]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()),
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
    ).then(() => self.clients.claim()),
  )
})

self.addEventListener("fetch", (event) => {
  const { request } = event
  if (request.method !== "GET") return

  const url = new URL(request.url)

  // Never cache API calls
  if (url.pathname.startsWith("/v1/") || url.pathname.startsWith("/api/")) {
    return
  }

  if (url.origin !== self.location.origin) return

  // SPA deep links (/login, /register, …): always network-first, fallback to index.html
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone()
            caches.open(CACHE).then((cache) => cache.put("/index.html", clone))
          }
          return response
        })
        .catch(() => caches.match("/index.html").then((cached) => cached || Response.error())),
    )
    return
  }

  // Static assets: cache-first with network update
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetched = fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone()
            caches.open(CACHE).then((cache) => cache.put(request, clone))
          }
          return response
        })
        .catch(() => cached)
      return cached || fetched
    }),
  )
})

self.addEventListener("sync", (event) => {
  if (event.tag === "cuisenio-sync") {
    event.waitUntil(Promise.resolve())
  }
})
