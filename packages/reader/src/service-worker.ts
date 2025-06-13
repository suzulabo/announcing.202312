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
        body: JSON.stringify({ ua: `SW: ${sw.navigator.userAgent}`, log: data }),
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

const readyClients = new Set<string>();

const onMessage = async (event: ExtendableMessageEvent) => {
  // clean up
  await Promise.allSettled(
    [...readyClients.values()].map(async (id) => {
      const c = await sw.clients.get(id);
      if (!c) {
        await log({ 'delete client': id });
        readyClients.delete(id);
      }
    }),
  );

  if (event.source && 'id' in event.source) {
    readyClients.add(event.source.id);
  }

  await log({ readyClients: [...readyClients.values()] });
};

sw.addEventListener('message', (event) => {
  event.waitUntil(onMessage(event));
});

const waitForClient = (id: string): Promise<boolean> => {
  if (readyClients.has(id)) {
    void log('already');
    return Promise.resolve(true);
  }

  return new Promise<boolean>((resolve) => {
    const timer = sw.setTimeout(() => {
      resolve(false);
      sw.removeEventListener('message', handler);
    }, 5000);

    const handler = (event: ExtendableMessageEvent) => {
      if (event.source && 'id' in event.source && event.source.id === id) {
        sw.removeEventListener('message', handler);
        sw.clearTimeout(timer);
        resolve(true);
      }
    };

    sw.addEventListener('message', handler);
  });
};

// https://github.com/firebase/firebase-js-sdk/blob/23069208726dc1924011eb84c8bf34d6f914a3a9/packages/messaging/src/listeners/sw-listeners.ts
const onPush = async (event: PushEvent) => {
  await log('push event');

  if (!event.data) {
    return;
  }
  const payload = event.data.json();

  await log({ payload });

  const notification = payload.notification;

  await sw.registration.showNotification(notification.title, {
    ...notification,
  });
};

const onNotificationClick = async (event: NotificationEvent) => {
  await log('notificationclick event');
  event.stopImmediatePropagation();
  event.notification.close();

  const notification = event.notification;

  await log({ notification: { body: notification.body, data: notification.data } });

  const channelID = notification.tag;
  if (!channelID) {
    await log('no channelID');
    return;
  }

  const link = `/${channelID}`;

  if (!isIOS()) {
    await sw.clients.openWindow(link);
    return;
  }

  const clientList = await sw.clients.matchAll({ type: 'window' });
  await log({ clientList: clientList.map((c) => c.id) });
  let client = clientList[0];
  if (!client) {
    await log('create client');
    client = (await sw.clients.openWindow('/notification')) ?? undefined;
  }

  if (client) {
    await log({ client });
    await client.focus();
    const ready = await waitForClient(client.id);
    await log({ ready });
    if (ready) {
      await log({ 'post message': client.id });
      client.postMessage({ type: 'openChannel', channelID });
    } else {
      await log('no ready');
      await client.navigate(link);
    }
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
