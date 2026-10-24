/// <reference lib="webworker" />
// Service worker: offline app shell, background checks (Periodic Background Sync) and notification clicks.
import { checkAlerts } from './lib/alerts';

declare const self: ServiceWorkerGlobalScope;

const CACHE = 'shell-v1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

// Network-first for our own files, so the app also opens offline.
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== self.location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request).then((r) => r ?? caches.match('./index.html')) as Promise<Response>),
  );
});

const notify = (title: string, opts: NotificationOptions) => self.registration.showNotification(title, opts);

self.addEventListener('periodicsync', (e: any) => {
  if (e.tag === 'mushroom-check') e.waitUntil(checkAlerts(notify));
});

self.addEventListener('message', (e) => {
  if (e.data === 'check') e.waitUntil(checkAlerts(notify, true));
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = new URL(e.notification.data?.url ?? './', self.registration.scope).href;
  e.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((list) => {
      const open = list.find((c) => c.url.startsWith(self.registration.scope));
      if (open) return open.navigate(url).then((c) => c?.focus());
      return self.clients.openWindow(url);
    }),
  );
});
