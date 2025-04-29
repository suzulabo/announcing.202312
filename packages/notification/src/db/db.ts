import { drizzle, DrizzleD1Database } from 'drizzle-orm/d1';
import { deleteTokens } from './tokens/deleteTokens';
import { putToken } from './tokens/putToken';
import { readTokens } from './tokens/readTokens';

type CFBindings = {
  D1_NOTIFICATION: D1Database;
};
type OptionalCFBindings = CFBindings | undefined;

const MAX_TOKENS = 50000;

export type DBContext = {
  db: DrizzleD1Database;
  maxTokens: number;
};

export const createAPI = (makeContext: (b: OptionalCFBindings) => DBContext) => {
  return {
    putToken: (params: Parameters<typeof putToken>[1], b: OptionalCFBindings) => {
      return putToken(makeContext(b), params);
    },
    deleteTokens: (params: Parameters<typeof deleteTokens>[1], b: OptionalCFBindings) => {
      return deleteTokens(makeContext(b), params);
    },
    readTokens: (params: Parameters<typeof readTokens>[1], b: OptionalCFBindings) => {
      return readTokens(makeContext(b), params);
    },
  };
};

export const createDB = () => {
  const makeContext = (b: OptionalCFBindings): DBContext => {
    return {
      db: drizzle(b?.D1_NOTIFICATION as D1Database),
      maxTokens: MAX_TOKENS,
    };
  };

  return createAPI(makeContext);
};
