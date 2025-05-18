import { configDotenv } from 'dotenv';
import { writeFile } from 'node:fs/promises';
import type { Unstable_RawEnvironment } from 'wrangler';

configDotenv({ path: '.wrangler.env.remote' });

const config: Unstable_RawEnvironment = {
  main: '.svelte-kit/cloudflare/_worker.js',
  compatibility_date: '2025-05-05',
  compatibility_flags: ['nodejs_compat_v2'],
  upload_source_maps: true,

  assets: {
    binding: 'ASSETS',
    directory: '.svelte-kit/cloudflare',
  },

  d1_databases: [
    {
      binding: 'D1',
      database_name: 'D1',
      database_id: 'local',
    },
  ],
  r2_buckets: [
    {
      binding: 'R2',
      bucket_name: 'local',
    },
  ],
};

const main = async () => {
  await writeFile('wrangler.local.jsonc', JSON.stringify(config, undefined, 2));

  const { PROJECT_NAME, D1_ID, R2_BUCKET_NAME } = process.env;

  if (PROJECT_NAME) {
    config.name = PROJECT_NAME;
  }
  if (D1_ID && config.d1_databases?.[0]) {
    config.d1_databases[0].database_id = D1_ID;
  }
  if (R2_BUCKET_NAME && config.r2_buckets?.[0]) {
    config.r2_buckets[0].bucket_name = R2_BUCKET_NAME;
  }

  await writeFile('wrangler.remote.jsonc', JSON.stringify(config, undefined, 2));
};

await main();
