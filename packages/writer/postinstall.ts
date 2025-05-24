import {
  getWranglerLocalEnv,
  getWranglerRemoteEnv,
} from '@announcing/cloudflare-support/wranglerEnv';
import { writeFile } from 'node:fs/promises';
import type { Unstable_RawConfig } from 'wrangler';

const localEnv = getWranglerLocalEnv();
const remoteEnv = getWranglerRemoteEnv();

const d1 = {
  binding: 'D1',
  database_name: 'd1',
  database_id: localEnv.D1_ID,
};

const r2 = {
  binding: 'R2',
  bucket_name: localEnv.R2_BUCKET_NAME,
};

const r2PostsLog = {
  binding: 'R2_POST_LOG',
  bucket_name: localEnv.R2_POST_LOG_BUCKET_NAME,
};

const workflows = [
  {
    binding: 'WF_STORE_POST_LOG',
    name: 'StorePostLogWorkflow',
    class_name: 'StorePostLogWorkflowEntrypoint',
  },
];

const servicesProcessMessageRun = {
  binding: 'WF_PROCESS_MESSAGE_RUN',
  service: localEnv.NOTIFICATION_PROJECT_NAME,
  entrypoint: 'ProcessMessageWorkflowRunEntrypoint',
};
const config: Unstable_RawConfig = {
  name: localEnv.WRITER_PROJECT_NAME,
  main: 'src/workers/index.ts',
  compatibility_date: '2025-05-05',
  compatibility_flags: ['nodejs_compat_v2'],
  upload_source_maps: true,

  assets: {
    binding: 'ASSETS',
    directory: '.svelte-kit/cloudflare',
  },

  d1_databases: [d1],
  r2_buckets: [r2, r2PostsLog],
  workflows,
  services: [servicesProcessMessageRun],
};

await writeFile('wrangler.local.jsonc', JSON.stringify(config, undefined, 2));

const remoteConfig: Unstable_RawConfig = {
  ...config,
  name: remoteEnv.WRITER_PROJECT_NAME,
  d1_databases: [{ ...d1, database_id: remoteEnv.D1_ID }],
  r2_buckets: [
    { ...r2, bucket_name: remoteEnv.R2_BUCKET_NAME },
    {
      ...r2PostsLog,
      bucket_name: remoteEnv.R2_POST_LOG_BUCKET_NAME,
    },
  ],
  services: [{ ...servicesProcessMessageRun, service: remoteEnv.NOTIFICATION_PROJECT_NAME }],
};

await writeFile('wrangler.remote.jsonc', JSON.stringify(remoteConfig, undefined, 2));
