// https://svelte.dev/docs/kit/service-workers
// https://github.com/microsoft/TypeScript/issues/11781

/// <reference lib="webworker" />

const sw = self as unknown as ServiceWorkerGlobalScope;

import { isIOS } from '$lib/platform/platform';
import { build, files, version } from '$service-worker';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';

{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (self as any).__WB_DISABLE_DEV_LOGS = true;
}

const log = async (...args: unknown[]) => {
  const clients = await sw.clients.matchAll();
  clients.forEach((client) => {
    client.postMessage({ type: 'log', args });
  });
};

{
  const precacheAssets = [...build, ...files].map((url) => {
    return { url, revision: version };
  });

  precacheAndRoute(precacheAssets);
  cleanupOutdatedCaches();
}

{
  const cacheFirstStrategy = new CacheFirst();
  const networkFirstStrategy = new NetworkFirst();

  const createRegexMatcher = (regex: RegExp) => {
    return ({ url }: { url: URL }) => {
      return regex.test(url.pathname);
    };
  };

  // CacheFirst: /api/channels/{channelID}/announcements/{announcementID}
  registerRoute(
    createRegexMatcher(/^\/api\/channels\/[^/]+\/announcements\/[^/]+$/),
    cacheFirstStrategy,
  );

  // CacheFirst: /s/{objectKey}
  registerRoute(createRegexMatcher(/^\/s\/[^/]+$/), cacheFirstStrategy);

  // NetworkFirst: /api/channels/{channelID}
  registerRoute(createRegexMatcher(/^\/api\/channels\/[^/]+$/), networkFirstStrategy);
}

sw.addEventListener('install', (event) => {
  event.waitUntil(sw.skipWaiting());
});
sw.addEventListener('activate', (event) => {
  event.waitUntil(sw.clients.claim());
});
sw.addEventListener('message', (event) => {
  event.waitUntil(log('Start'));
});

sw.addEventListener('push', (event) => {
  event.waitUntil(
    (async () => {
      if (!event.data) {
        return;
      }
      const payload = event.data.json();

      await log('payload', payload);

      const notification = payload.notification;

      await sw.registration.showNotification(notification.title, notification);
    })(),
  );
});

sw.addEventListener('notificationclick', (event) => {
  // https://github.com/mdn/browser-compat-data/issues/22959#issuecomment-2336683759
  // https://stackoverflow.com/questions/76399649/why-isnt-the-notificationclick-event-called-on-ios-during-pwa-push-notificati
  event.preventDefault();

  event.waitUntil(
    (async () => {
      await log('notificationclick');
      event.notification.close();

      const channelID = event.notification.tag;

      if (!channelID) {
        await log('Missing channelID');
        return;
      }

      const url = `/${channelID}`;
      if (isIOS()) {
        const clients = await sw.clients.matchAll({ includeUncontrolled: true, type: 'all' });

        for (const client of clients) {
          client.postMessage({ type: 'open', url });
          return;
        }

        const client = await sw.clients.openWindow('/notification');

        if (client) {
          client.postMessage({ type: 'open', url });
        }
      } else {
        const clients = await sw.clients.matchAll({ includeUncontrolled: true, type: 'all' });
        for (const client of clients) {
          client.postMessage({ type: 'open', url });
          return;
        }

        await sw.clients.openWindow(url);
      }
    })(),
  );
});
