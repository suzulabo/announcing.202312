import { configDotenv } from 'dotenv';
import { writeFile } from 'node:fs/promises';
import type { Unstable_RawConfig } from 'wrangler';

configDotenv({ path: '.wrangler.env.remote' });

const { PROJECT_NAME, D1_ID, R2_BUCKET_NAME } = process.env;

const d1 = {
  binding: 'D1',
  database_name: 'D1',
  database_id: 'D1_LOCAL',
  migrations_dir: './migrations',
};

const r2 = {
  binding: 'R2',
  bucket_name: 'R2_LOCAL',
};

const config: Unstable_RawConfig = {
  ...(PROJECT_NAME && { name: PROJECT_NAME }),
  main: '.svelte-kit/cloudflare/_worker.js',
  compatibility_date: '2025-05-05',
  compatibility_flags: ['nodejs_compat_v2'],
  upload_source_maps: true,

  assets: {
    binding: 'ASSETS',
    directory: '.svelte-kit/cloudflare',
  },

  d1_databases: [d1],
  r2_buckets: [r2],
};

await writeFile('wrangler.local.jsonc', JSON.stringify(config, undefined, 2));

const remoteConfig: Unstable_RawConfig = {
  ...config,
  d1_databases: [{ ...d1, database_id: D1_ID ?? 'D1_REMOTE' }],
  r2_buckets: [{ ...r2, bucket_name: R2_BUCKET_NAME ?? 'R2_REMOTE' }],
};

await writeFile('wrangler.remote.jsonc', JSON.stringify(remoteConfig, undefined, 2));
