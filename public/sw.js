// StudyHub service worker.
//
// Previous version: a single pure "cache-first" fetch handler for every
// request. Once any asset was cached it was served forever — including the
// HTML shell and JS bundles — with no path back to a fresh copy short of
// the cache name changing. Since Next.js content-hashes its chunk
// filenames per build, a user who had the app open across a deploy could
// end up on an HTML shell referencing chunks the server no longer had,
// or just silently never see a shipped fix. That's the classic PWA
// "stuck on an old version" bug, and this file was it.
//
// Fixed strategy:
//  - Navigation requests (the HTML shell) go network-first, so a user who
//    is online always gets the latest shell; only offline falls back to
//    whatever shell was last cached.
//  - Same-origin static assets (JS/CSS/images/fonts, notably the
//    content-hashed /_next/static/ chunks) go stale-while-revalidate:
//    serve instantly from cache for speed, then re-fetch in the
//    background and update the cache so the *next* load is current.
//  - Cross-origin requests are left alone entirely (no opaque-response
//    caching of third-party API calls).
const CACHE = "studyhub-v2";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // don't intercept cross-origin (APIs, fonts CDNs, etc.)

  // Navigations (HTML shell): network-first, falling back to cache offline.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((cached) => cached || caches.match("/")))
    );
    return;
  }

  // Everything else same-origin: stale-while-revalidate.
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
