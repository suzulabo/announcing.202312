import { env } from '$env/dynamic/private';
import { setDBEnv, setStorage } from '@announcing/db';
import { createLibSqlTokenStore } from '@announcing/notification/tokenStores/libsql';
import { createClient } from '@libsql/client';
import { type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

setDBEnv({ url: env.DB_URL, authToken: env.DB_AUTH_TOKEN });

const { S3_CLIENT_PARAMS, S3_BUCKET, S3_PREFIX } = env;

if (S3_CLIENT_PARAMS && S3_BUCKET) {
  const createS3Storage = (await import('@announcing/db/S3Storage')).createS3Storage;
  setStorage(createS3Storage(S3_CLIENT_PARAMS, S3_BUCKET, S3_PREFIX));
} else {
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
