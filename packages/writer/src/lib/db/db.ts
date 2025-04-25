import { env } from '$env/dynamic/private';
import { STORAGE_PREFIX } from '$env/static/private';
import { createDB } from '@announcing/db';
import { createR2Storage } from '@announcing/db/R2Storage';
import type { R2Bucket } from '@cloudflare/workers-types';

export const db = createDB({ url: env.DB_URL, authToken: env.DB_AUTH_TOKEN });

export const getStorage = async (r2: R2Bucket | undefined) => {
  if (r2) {
    return createR2Storage(r2, STORAGE_PREFIX);
  }
  const createLocalStorage = (await import('@announcing/db/LocalStorage')).createLocalStorage;
  return createLocalStorage();
};
