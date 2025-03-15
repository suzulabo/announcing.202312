import { drizzle as drizzleLibSql, type LibSQLDatabase } from 'drizzle-orm/libsql';

type DBEnv = {
  url: string;
  authToken?: string | undefined;
};

let env: DBEnv | undefined = undefined;
let db: LibSQLDatabase | undefined;

const createDB = () => {
  if (!env) {
    throw new Error('DBEnv is not set');
  }

  const { url, authToken } = env;
  return drizzleLibSql({
    connection: {
      url,
      ...(authToken && { authToken }),
    },
  });
};

export const setDBEnv = (v: DBEnv) => {
  env = v;
};

export const getDB = (forceCreate = false): LibSQLDatabase => {
  if (!db || forceCreate) {
    db = createDB();
  }
  return db;
};
