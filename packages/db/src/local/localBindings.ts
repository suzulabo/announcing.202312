import type { D1Database, R2Bucket } from '@cloudflare/workers-types';
import { drizzle } from 'drizzle-orm/d1';
import { migrate } from 'drizzle-orm/d1/migrator';
import { Miniflare } from 'miniflare';
import { resolve } from 'node:path';

const LOCAL_DIR = '../db-local';
const MIGRATIONS_DIR = '../db/migrations';

export const createLocalBindings = async (
  memory = false,
): Promise<{ D1: D1Database; R2: R2Bucket; mf: Miniflare }> => {
  const path = memory ? 'memory:' : `file://${resolve(LOCAL_DIR)}`;

  const mf = new Miniflare({
    modules: true,
    script: '',
    d1Databases: ['d1'],
    d1Persist: `${path}/d1`,
    r2Buckets: ['r2'],
    r2Persist: `${path}/r2`,
  });

  const D1 = await mf.getD1Database('d1');
  const R2 = (await mf.getR2Bucket('r2')) as unknown as R2Bucket;

  const db = drizzle(D1);

  await migrate(db, { migrationsFolder: MIGRATIONS_DIR });

  return { D1, R2, mf };
};
