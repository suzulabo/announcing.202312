import { type AnyD1Database } from 'drizzle-orm/d1';

const env: {
  d1?: AnyD1Database;
  logger: boolean;
} = { logger: false };

export const setDBEnv = (v: typeof env) => {
  Object.assign(env, v);
};

export { env };
