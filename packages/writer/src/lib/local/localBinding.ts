import { createWorkflowLocal } from '@announcing/cloudflare-support/local';
import { Miniflare } from 'miniflare';
import { resolve } from 'node:path';
import { StorePostLogWorkflowEntrypoint } from '../../workers/storePostLogWorkflow';

const LOCAL_DIR = '../db-local/v3';

export const createLocalBindings = async () => {
  const path = `file://${resolve(LOCAL_DIR)}`;

  const mf = new Miniflare({
    modules: true,
    script: '',
    d1Persist: `${path}/d1`,
    r2Persist: `${path}/r2`,
    d1Databases: { D1: 'd1-local' },
    r2Buckets: { R2: 'r2-local', R2_POST_LOG: 'r2-post-log-local' },
  });

  const bindings = await mf.getBindings<{ D1: D1Database; R2: R2Bucket; R2_POST_LOG: R2Bucket }>();

  const WF_STORE_POST_LOG = createWorkflowLocal(StorePostLogWorkflowEntrypoint, bindings);

  return { ...bindings, WF_STORE_POST_LOG };
};
