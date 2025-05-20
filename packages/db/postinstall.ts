import { configDotenv } from 'dotenv';
import { writeFile } from 'node:fs/promises';
import type { Unstable_RawConfig } from 'wrangler';

configDotenv({ path: '.wrangler.env.remote' });

const { D1_ID, R2_BUCKET_NAME } = process.env;

const d1 = {
  binding: 'D1',
  database_name: 'd1',
  database_id: 'd1-local',
  migrations_dir: './migrations',
};

const r2 = {
  binding: 'R2',
  bucket_name: 'r2-local',
};

const config: Unstable_RawConfig = {
  env: {
    local: {
      d1_databases: [d1],
      r2_buckets: [r2],
    },
    remote: {
      d1_databases: [{ ...d1, database_id: D1_ID ?? 'd1-remote' }],
      r2_buckets: [{ ...r2, bucket_name: R2_BUCKET_NAME ?? 'r2-remote' }],
    },
  },
};

await writeFile('wrangler.jsonc', JSON.stringify(config, undefined, 2));
