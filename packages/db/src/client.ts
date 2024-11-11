import { D1Database, D1DatabaseAPI } from '@miniflare/d1';
import { createSQLiteDB } from '@miniflare/shared';
import { drizzle as drizzleD1 } from 'drizzle-orm/d1';
import { env } from './api/env';

const createDB = async () => {
  if (env.d1) {
    return drizzleD1(env.d1, { logger: env.logger });
  }
  const sqliteDb = await createSQLiteDB('../db-dev/dev.db');
  const db = new D1Database(new D1DatabaseAPI(sqliteDb));
  return drizzleD1(db, { logger: env.logger });
};

let db: Awaited<ReturnType<typeof createDB>> | undefined;

export const getDB = async () => {
  if (!db) {
    db = await createDB();
  }

  return db;
};
