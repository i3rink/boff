/* BOFF service worker - caches the app shell so it opens offline. */
var CACHE = "boff-shell-v1";
var SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png"];

self.addEventListener("install", function (e) {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL).catch(function () {}); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.map(function (k) { if (k !== CACHE) return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  var url = req.url;
  /* Never cache Supabase, fonts, or the Supabase library. Always go to the network. */
  if (req.method !== "GET" || url.indexOf("supabase.co") > -1 || url.indexOf("supabase.in") > -1 || url.indexOf("jsdelivr.net") > -1 || url.indexOf("fonts.g") > -1) {
    return; /* let the browser handle it normally */
  }
  /* App shell: serve from cache first, fall back to network, then to index for navigations. */
  e.respondWith(
    caches.match(req).then(function (hit) {
      return hit || fetch(req).then(function (res) {
        if (res && res.status === 200 && res.type === "basic") {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () {
        if (req.mode === "navigate") return caches.match("./index.html");
      });
    })
  );
});
