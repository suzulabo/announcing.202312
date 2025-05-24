import { createWorkerEntrypointLocal } from '@announcing/cloudflare-support/local';
import { PutTokenEntrypoint } from '@announcing/notification';
import { Miniflare } from 'miniflare';
import { resolve } from 'node:path';

const LOCAL_DIR = '../db-local/v3';

export const createLocalBindings = async () => {
  const path = `file://${resolve(LOCAL_DIR)}`;

  const mf = new Miniflare({
    modules: true,
    script: '',
    d1Persist: `${path}/d1`,
    r2Persist: `${path}/r2`,
    d1Databases: { D1: 'd1-local', D1_NOTIFICATION: 'd1-notification-local' },
    r2Buckets: { R2: 'r2-local' },
  });

  const bindings = await mf.getBindings<{
    D1: D1Database;
    D1_NOTIFICATION: D1Database;
    R2: R2Bucket;
  }>();

  const WK_PUT_TOKEN = createWorkerEntrypointLocal(PutTokenEntrypoint, bindings);

  return { ...bindings, WK_PUT_TOKEN };
};
