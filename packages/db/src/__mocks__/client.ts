import { drizzle as drizzleBetterSqlite3 } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { drizzle as drizzleD1 } from 'drizzle-orm/d1';

import { D1Database, D1DatabaseAPI } from '@miniflare/d1';
import { createSQLiteDB } from '@miniflare/shared';
import * as schema from '../schema';

const sqliteDb = await createSQLiteDB(':memory:');

{
  const db = drizzleBetterSqlite3(sqliteDb, { schema });
  migrate(db, { migrationsFolder: './drizzle' });
}

const d1 = new D1Database(new D1DatabaseAPI(sqliteDb));
const db = drizzleD1(d1, { schema });

export const getDB = () => {
  return db;
};
