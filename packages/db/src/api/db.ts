import { drizzle as drizzleD1, DrizzleD1Database, type AnyD1Database } from 'drizzle-orm/d1';

import { drizzle as drizzleLibSql, type LibSQLDatabase } from 'drizzle-orm/libsql';

const ctx = {} as { d1?: AnyD1Database; db?: DrizzleD1Database };

const db = drizzleLibSql({
  connection: {
    url: 'libsql://announcing-suzulabo.turso.io',
    authToken:
      'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3MzE5OTM3MTUsImlkIjoiYTMwOGVmY2ItMjY3Mi00Nzk0LTkwMWMtNmU2NDhiZTAzNWExIn0.Hj6kZ-aBZlDflAE77jeT_mTR9HNR8bMZIFEvLsQPSZJKAYke6XVqacFEDpo-4E3IBU8OLmYSNC6Dd06QXz6NDA',
  },
});

export const setDBEnv = (d1: AnyD1Database, logger = false) => {
  if (ctx.d1 !== d1) {
    ctx.db = drizzleD1(d1, { logger });
    ctx.d1 = d1;
  }
};

export const getDB = (): LibSQLDatabase => {
  if (!ctx.db) {
    throw new Error('DB is not set');
  }

  return db;
};
