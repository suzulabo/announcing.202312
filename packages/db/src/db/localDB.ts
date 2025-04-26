import type { R2Bucket } from '@cloudflare/workers-types';
import { drizzle } from 'drizzle-orm/d1';
import { migrate } from 'drizzle-orm/d1/migrator';
import { Miniflare } from 'miniflare';
import { resolve } from 'node:path';
import { createAPI, createDB, type DBContext } from './db';

const LOCAL_DIR = '../db-local';
const DRRIZLE_DIR = '../db/drizzle';

export const createLocalDB = async (memory = false): Promise<ReturnType<typeof createDB>> => {
  const path = memory ? 'memory:' : `file://${resolve(LOCAL_DIR)}`;

  const mf = new Miniflare({
    modules: true,
    script: '',
    d1Databases: ['d1'],
    d1Persist: `${path}/d1`,
    r2Buckets: ['r2'],
    r2Persist: `${path}/r2`,
  });

  const d1 = await mf.getD1Database('d1');
  const r2 = (await mf.getR2Bucket('r2')) as unknown as R2Bucket;

  const db = drizzle(d1);

  await migrate(db, { migrationsFolder: DRRIZLE_DIR });

  const makeContext = (): DBContext => {
    return {
      db,
      r2,
      bucketPrefix: '',
    };
  };

  return createAPI(makeContext);
};
