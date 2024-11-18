import { drizzle as drizzleD1, DrizzleD1Database, type AnyD1Database } from 'drizzle-orm/d1';

const ctx = {} as { d1?: AnyD1Database; db?: DrizzleD1Database };

export const setDBEnv = (d1: AnyD1Database, logger = false) => {
  if (ctx.d1 !== d1) {
    ctx.db = drizzleD1(d1, { logger });
    ctx.d1 = d1;
  }
};

export const getDB = () => {
  if (!ctx.db) {
    throw new Error('DB is not set');
  }

  return ctx.db;
};
