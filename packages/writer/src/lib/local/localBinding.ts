import { GOOGLE_CREDENTIALS_BASE64 } from '$env/static/private';
import {
  createWorkerEntrypointLocal,
  createWorkflowLocal,
} from '@announcing/cloudflare-support/local';
import { getWranglerLocalEnv } from '@announcing/cloudflare-support/wranglerEnv';
import {
  ProcessMessageWorkflowEntrypoint,
  ProcessMessageWorkflowRunEntrypoint,
  SendMessageWorkflowEntrypoint,
} from '@announcing/notification';
import { Miniflare } from 'miniflare';
import { resolve } from 'node:path';
import { StorePostLogWorkflowEntrypoint } from '../../workers/storePostLogWorkflow';

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
    r2Buckets: { R2: localEnv.R2_BUCKET_NAME, R2_POST_LOG: localEnv.R2_POST_LOG_BUCKET_NAME },
  });

  const bindings = await mf.getBindings<{
    D1: D1Database;
    D1_NOTIFICATION: D1Database;
    R2: R2Bucket;
    R2_POST_LOG: R2Bucket;
  }>();

  const WF_STORE_POST_LOG = createWorkflowLocal(StorePostLogWorkflowEntrypoint, bindings);

  const WF_PROCESS_MESSAGE_RUN = ((): ProcessMessageWorkflowRunEntrypoint => {
    if (!GOOGLE_CREDENTIALS_BASE64) {
      return {
        createInstance: () => {
          return Promise.resolve({ id: '' });
        },
      } as unknown as ProcessMessageWorkflowRunEntrypoint;
    }

    const WF_SEND_MESSAGE = createWorkflowLocal(SendMessageWorkflowEntrypoint, {
      D1_NOTIFICATION: bindings.D1_NOTIFICATION,
      GOOGLE_CREDENTIALS_BASE64,
    });
    const WF_PROCESS_MESSAGE = createWorkflowLocal(ProcessMessageWorkflowEntrypoint, {
      D1_NOTIFICATION: bindings.D1_NOTIFICATION,
      WF_SEND_MESSAGE,
    });
    return createWorkerEntrypointLocal(ProcessMessageWorkflowRunEntrypoint, {
      WF_PROCESS_MESSAGE,
    });
  })();

  return { ...bindings, WF_STORE_POST_LOG, WF_PROCESS_MESSAGE_RUN };
};
