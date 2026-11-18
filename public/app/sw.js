/* Wishtale Service Worker (Dev 095).
   Hält nur die festen Programmdateien (/assets/, mit Prüfsumme im Namen) und eine Seite für „ohne Netz“ bereit.
   Daten, Anmeldung und /api/ gehen immer direkt ans Netz und werden nie zwischengespeichert. */
const VERSION = 'wt-1';
const ASSETS = VERSION + '-assets';
const PAGES = VERSION + '-pages';
const MAX_ASSETS = 80;

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(PAGES);
    // Als eigene Antwort ablegen, damit eine Weiterleitung (cleanUrls) nicht mitgespeichert wird.
    const r = await fetch('/app/offline.html', { cache: 'no-store' });
    if (r.ok) await c.put('offline', new Response(await r.text(), { headers: { 'Content-Type': 'text/html; charset=utf-8' } }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (!k.startsWith(VERSION + '-')) await caches.delete(k);
    await self.clients.claim();
  })());
});

async function trim() {
  const c = await caches.open(ASSETS);
  const keys = await c.keys();
  for (let i = 0; i < keys.length - MAX_ASSETS; i++) await c.delete(keys[i]);
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // Supabase, Amazon und Co. nie anfassen
  if (url.pathname.startsWith('/api/')) return;

  if (req.mode === 'navigate') {
    // Immer zuerst das Netz, nur ohne Verbindung die freundliche Offline-Seite.
    e.respondWith(fetch(req).catch(async () => (await caches.open(PAGES)).match('offline').then(r => r || Response.error())));
    return;
  }
  if (url.pathname.startsWith('/assets/') || url.pathname.startsWith('/app/icons/')) {
    // Dateien mit Prüfsumme ändern sich nie, darum zuerst aus dem Zwischenspeicher.
    e.respondWith((async () => {
      const c = await caches.open(ASSETS);
      const hit = await c.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok && res.type === 'basic') { await c.put(req, res.clone()); trim(); }
      return res;
    })());
  }
});
