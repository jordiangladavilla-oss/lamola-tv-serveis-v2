// KILL-SWITCH SW. Any browser still holding the old SW will pick up this
// file on the next navigation, install it, activate it, and at that point
// it will (1) delete every cache, (2) unregister itself, (3) reload all
// clients. After that, no SW is registered on this origin scope.
//
// The kiosk no longer registers a SW from JS — see js/tv/main.js. This file
// remains only so the browser detects an update of the previously-installed
// SW and triggers the cleanup. Once every client has run this, sw.js can
// be deleted from the repo entirely.

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
    } catch (e) { /* ignore */ }
    try {
      await self.registration.unregister();
    } catch (e) { /* ignore */ }
    try {
      const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      for (const c of clients) {
        try { c.navigate(c.url); } catch (e) { /* ignore */ }
      }
    } catch (e) { /* ignore */ }
  })());
});

// Pass-through: do not intercept any fetch.
