// Sube la versión (v4 -> v5) cada vez que cambies index.html.
const C = "tabla-periodica-v4";
const F = ["./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(C).then(c => Promise.all(F.map(u =>
    fetch(new Request(u, {cache: "reload"})).then(r => { if (r.ok) return c.put(u, r); }).catch(() => {})
  ))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== C).map(n => caches.delete(n)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const q = e.request;
  if (q.method !== "GET") return;
  e.respondWith(fetch(q).then(r => {
    if (r.ok && r.type === "basic") { const cp = r.clone(); caches.open(C).then(c => c.put(q, cp)); }
    return r;
  }).catch(() => caches.match(q).then(h => h || (q.mode === "navigate" ? caches.match("./index.html") : Response.error()))));
});
