import { drizzle } from 'drizzle-orm/d1';
import { migrate } from 'drizzle-orm/d1/migrator';
import { Miniflare } from 'miniflare';
import { resolve } from 'node:path';

const LOCAL_DIR = '../db-local';
const MIGRATIONS_DIR = '../notification/migrations';

export const createLocalBindings = async (
  memory = false,
): Promise<{ D1_NOTIFICATION: D1Database }> => {
  const path = memory ? 'memory:' : `file://${resolve(LOCAL_DIR)}`;

  const mf = new Miniflare({
    modules: true,
    script: '',
    d1Databases: ['D1_NOTIFICATION'],
    d1Persist: `${path}/d1-notification`,
  });

  const D1_NOTIFICATION = await mf.getD1Database('D1_NOTIFICATION');

  const db = drizzle(D1_NOTIFICATION);

  await migrate(db, { migrationsFolder: MIGRATIONS_DIR });

  return { D1_NOTIFICATION };
};
