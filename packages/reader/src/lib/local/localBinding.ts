import { createWorkerEntrypointLocal } from '@announcing/cloudflare-support/local';
import { getWranglerLocalEnv } from '@announcing/cloudflare-support/wranglerEnv';
import { PutTokenEntrypoint } from '@announcing/notification';
import { Miniflare } from 'miniflare';
import { resolve } from 'node:path';

const LOCAL_DIR = '../db-local/v3';

const localEnv = getWranglerLocalEnv();

export const createLocalBindings = async () => {
  const path = `file://${resolve(LOCAL_DIR)}`;

  const mf = new Miniflare({
    modules: true,
    script: '',
    d1Persist: `${path}/d1`,
    r2Persist: `${path}/r2`,
    d1Databases: { D1: localEnv.D1_ID, D1_NOTIFICATION: localEnv.D1_NOTIFICATION_ID },
    r2Buckets: { R2: localEnv.R2_BUCKET_NAME },
  });

  const bindings = await mf.getBindings<{
    D1: D1Database;
    D1_NOTIFICATION: D1Database;
    R2: R2Bucket;
  }>();

  const WK_PUT_TOKEN = createWorkerEntrypointLocal(PutTokenEntrypoint, bindings);

  return { ...bindings, WK_PUT_TOKEN };
};
