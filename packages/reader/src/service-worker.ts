// https://svelte.dev/docs/kit/service-workers
// https://github.com/microsoft/TypeScript/issues/11781

/// <reference lib="webworker" />

const sw = self as unknown as ServiceWorkerGlobalScope;

import { PUBLIC_LOG, PUBLIC_READER_SENTRY_DSN } from '$env/static/public';
import { isIOS } from '$lib/platform/platform';
import { build, files, version } from '$service-worker';
import * as Sentry from '@sentry/browser';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';

{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (self as any).__WB_DISABLE_DEV_LOGS = true;
}

if (PUBLIC_READER_SENTRY_DSN) {
  Sentry.init({
    dsn: PUBLIC_READER_SENTRY_DSN,
  });
}

const log: (data: unknown) => Promise<void> = (() => {
  if (PUBLIC_LOG) {
    return async (data: unknown) => {
      await sw.fetch(`/api/log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ua: sw.navigator.userAgent, log: data }),
      });
    };
  }
  return () => {
    return Promise.resolve();
  };
})();

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

// https://github.com/firebase/firebase-js-sdk/blob/23069208726dc1924011eb84c8bf34d6f914a3a9/packages/messaging/src/listeners/sw-listeners.ts
const onPush = async (event: PushEvent) => {
  await log('push event');

  if (!event.data) {
    return;
  }
  const payload = event.data.json();

  await log({ payload });

  const notification = payload.notification;

  await sw.registration.showNotification(notification.title, notification);
};

const onNotificationClick = async (event: NotificationEvent) => {
  await log('notificationclick event');
  event.stopImmediatePropagation();
  event.notification.close();

  const notification = event.notification;
  const tag = notification.tag;
  if (!tag) {
    await log('no tag');
    return;
  }

  const link = `/${tag}`;

  if (!isIOS()) {
    await sw.clients.openWindow(link);
    return;
  }

  const clientList = (await sw.clients.matchAll({})) as WindowClient[];
  let client = clientList.shift();
  if (!client) {
    await log('create client');
    client = (await sw.clients.openWindow('/notification')) ?? undefined;
  }

  if (client) {
    await client.focus();
    await client.navigate(link);
  } else {
    await log('no client');
  }
};

sw.addEventListener('push', (event) => {
  event.waitUntil(onPush(event));
});

sw.addEventListener('notificationclick', (event) => {
  event.waitUntil(onNotificationClick(event));
});
