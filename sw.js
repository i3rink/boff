/* BOFF service worker. Always serves the freshest app page when online, caches the shell for offline. */
var CACHE = "boff-shell-v3";
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
  /* Never touch Supabase, fonts, or the Supabase library. Always go straight to the network. */
  if (req.method !== "GET" || url.indexOf("supabase.co") > -1 || url.indexOf("supabase.in") > -1 || url.indexOf("jsdelivr.net") > -1 || url.indexOf("fonts.g") > -1) {
    return;
  }
  var isPage = req.mode === "navigate" || url.indexOf("index.html") > -1;
  if (isPage) {
    /* Pull the page fresh from the server every time, bypassing the browser HTTP cache. Fall back to cache only when offline. */
    e.respondWith(
      fetch(req.url, { cache: "no-store", credentials: "same-origin" }).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put("./index.html", copy); });
        return res;
      }).catch(function () {
        return caches.match("./index.html").then(function (hit) { return hit || caches.match("./"); });
      })
    );
    return;
  }
  /* Cache first for the steady stuff (icons, manifest). */
  e.respondWith(
    caches.match(req).then(function (hit) {
      return hit || fetch(req).then(function (res) {
        if (res && res.status === 200 && res.type === "basic") {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      });
    })
  );
});
