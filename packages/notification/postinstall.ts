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
      binding: 'D1_NOTIFICATION',
      database_name: 'D1_NOTIFICATION',
      database_id: 'local',
      migrations_dir: './migrations',
    },
  ],
};

const main = async () => {
  await writeFile('wrangler.local.jsonc', JSON.stringify(config, undefined, 2));

  const { PROJECT_NAME, D1_NOTIFICATION_ID } = process.env;

  if (PROJECT_NAME) {
    config.name = PROJECT_NAME;
  }
  if (D1_NOTIFICATION_ID && config.d1_databases?.[0]) {
    config.d1_databases[0].database_id = D1_NOTIFICATION_ID;
  }

  await writeFile('wrangler.remote.jsonc', JSON.stringify(config, undefined, 2));
};

await main();
