// https://svelte.dev/docs/kit/service-workers
// https://github.com/microsoft/TypeScript/issues/11781

/// <reference lib="webworker" />

const sw = self as unknown as ServiceWorkerGlobalScope;

import { build, files, version } from '$service-worker';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { registerRoute, Route } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';

{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (self as any).__WB_DISABLE_DEV_LOGS = true;
}

{
  const precacheAssets = [...build, ...files].map((url) => {
    return { url, revision: version };
  });

  precacheAndRoute(precacheAssets);
  cleanupOutdatedCaches();
}

{
  const imageRoute = new Route(({ sameOrigin, url }) => {
    if (!sameOrigin) {
      return false;
    }
    if (url.pathname.startsWith('/api/channels/')) {
      return true;
    }
    if (url.pathname.startsWith('/s/')) {
      return true;
    }

    return false;
  }, new CacheFirst());

  registerRoute(imageRoute);
}

sw.addEventListener('push', (event) => {
  if (!event.data) {
    return;
  }
  const payload = event.data.json();

  console.log('payload', payload);

  const name = payload.notification.data.name;

  const title = `${name} : New announcement`;
  const options = payload.notification;

  event.waitUntil(sw.registration.showNotification(title, options));
});

sw.addEventListener('notificationclick', (event) => {
  console.log('notificationclick', event.notification);

  event.notification.close();

  const channelID = event.notification.data.channelID;
  if (channelID) {
    event.waitUntil(sw.clients.openWindow(`/${channelID}`));
  }
});
