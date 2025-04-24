import { env } from '$env/dynamic/private';
import { createLibSqlTokenStore } from '@announcing/notification/tokenStores/libsql';
import { createClient } from '@libsql/client';
import { type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

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
