import { drizzle as drizzleBetterSqlite3 } from 'drizzle-orm/better-sqlite3';

import { D1Database, D1DatabaseAPI } from '@miniflare/d1';
import { createSQLiteDB } from '@miniflare/shared';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as schema from '../schema';

type Params = {
  inMemory?: boolean;
  migration?: boolean;
};

export const createLocalDB = async (params: Params = { inMemory: false, migration: false }) => {
  const { inMemory, migration } = params;

  const sqliteDb = await createSQLiteDB(inMemory ? ':memory:' : '../db-dev/dev.db');

  if (migration) {
    const db = drizzleBetterSqlite3(sqliteDb, { schema });
    migrate(db, { migrationsFolder: './drizzle' });
  }

  const d1 = new D1Database(new D1DatabaseAPI(sqliteDb));

  return d1;
};
