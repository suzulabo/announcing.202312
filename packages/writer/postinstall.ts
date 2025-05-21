import { configDotenv } from 'dotenv';
import { writeFile } from 'node:fs/promises';
import type { Unstable_RawConfig } from 'wrangler';

configDotenv({ path: '.wrangler.env.remote' });

const { PROJECT_NAME, D1_ID, R2_BUCKET_NAME, R2_POST_LOG_BUCKET_NAME } = process.env;

const d1 = {
  binding: 'D1',
  database_name: 'd1',
  database_id: 'd1-local',
};

const r2 = {
  binding: 'R2',
  bucket_name: 'r2-local',
};

const r2PostsLog = {
  binding: 'R2_POST_LOG',
  bucket_name: 'r2-post-log-local',
};

const workflows = [
  {
    binding: 'WF_STORE_POST_LOG',
    name: 'StorePostLogWorkflow',
    class_name: 'StorePostLogWorkflowEntrypoint',
  },
];

const services = [
  {
    binding: 'WF_PROCESS_MESSAGE_RUN',
    service: 'announcing-notification',
    entrypoint: 'ProcessMessageWorkflowRunEntrypoint',
  },
];

const config: Unstable_RawConfig = {
  ...(PROJECT_NAME && { name: PROJECT_NAME }),
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
  services,
};

await writeFile('wrangler.local.jsonc', JSON.stringify(config, undefined, 2));

const remoteConfig: Unstable_RawConfig = {
  ...config,
  d1_databases: [{ ...d1, database_id: D1_ID ?? 'd1-remote' }],
  r2_buckets: [
    { ...r2, bucket_name: R2_BUCKET_NAME ?? 'r2-remote' },
    {
      ...r2PostsLog,
      bucket_name: R2_POST_LOG_BUCKET_NAME ?? 'r2-post-log-remote',
    },
  ],
};

await writeFile('wrangler.remote.jsonc', JSON.stringify(remoteConfig, undefined, 2));
