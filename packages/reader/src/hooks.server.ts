import { env } from '$env/dynamic/private';
import { CF } from '$env/static/private';
import { setDBEnv, setStorage } from '@announcing/db';
import { createClient } from '@libsql/client';
import { type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

import { createLibSqlTokenStore } from '@announcing/notification/tokenStores/libsql';

setDBEnv({ url: env.DB_URL, authToken: env.DB_AUTH_TOKEN });

if (!CF) {
  const createLocalStorage = (await import('@announcing/db/LocalStorage')).createLocalStorage;
  setStorage(createLocalStorage());
}

const notificationTokenStoreHandle: Handle = ({ resolve, event }) => {
  const client = createClient({
    url: env.NOTIFICATION_DB_URL,
    authToken: env.NOTIFICATION_DB_AUTH_TOKEN,
  });

  const notificationTokenStore = createLibSqlTokenStore({
    client,
  });

  event.locals.tokenStore = notificationTokenStore;

  return resolve(event);
};

export const handle = sequence(notificationTokenStoreHandle);
