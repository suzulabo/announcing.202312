// https://svelte.dev/docs/kit/service-workers
// https://github.com/microsoft/TypeScript/issues/11781

/// <reference lib="webworker" />

const sw = self as unknown as ServiceWorkerGlobalScope;

import { build, files, version } from '$service-worker';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';

const precacheAssets = [...build, ...files].map((url) => {
  return { url, revision: version };
});

precacheAndRoute(precacheAssets);
cleanupOutdatedCaches();

sw.addEventListener('push', (event) => {
  if (!event.data) {
    return;
  }
  const data = event.data.json();
  const { title, body } = data.notification;
  const options = {
    body,
  };

  event.waitUntil(sw.registration.showNotification(title, options));
});

sw.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url = event.notification.data?.url;
  if (url) {
    event.waitUntil(sw.clients.openWindow(url));
  }
});
