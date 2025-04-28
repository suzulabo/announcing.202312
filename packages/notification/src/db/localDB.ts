import { drizzle, DrizzleD1Database } from 'drizzle-orm/d1';
import { migrate } from 'drizzle-orm/d1/migrator';
import { Miniflare } from 'miniflare';
import { resolve } from 'node:path';
import { createAPI, createDB, type DBContext } from './db';

const LOCAL_DIR = '../db-local';
const MIGRATIONS_DIR = '../notification/migrations';

export const createLocalDB = async (
  memory = false,
  maxTokens = 5000,
): Promise<ReturnType<typeof createDB> & { d1: D1Database; drizzleDB: DrizzleD1Database }> => {
  const path = memory ? 'memory:' : `file://${resolve(LOCAL_DIR)}`;

  const mf = new Miniflare({
    modules: true,
    script: '',
    d1Databases: ['notificationD1'],
    d1Persist: `${path}/d1-notification`,
  });

  const d1 = await mf.getD1Database('notificationD1');

  const db = drizzle(d1);

  await migrate(db, { migrationsFolder: MIGRATIONS_DIR });

  const makeContext = (): DBContext => {
    return {
      db,
      maxTokens,
    };
  };

  const result = createAPI(makeContext);
  return { ...result, d1, drizzleDB: db };
};
