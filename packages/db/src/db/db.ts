import { drizzle as drizzleLibSql, LibSQLDatabase } from 'drizzle-orm/libsql';

export const createDB = (env: { url: string; authToken?: string | undefined }): LibSQLDatabase => {
  const { url, authToken } = env;
  return drizzleLibSql({
    connection: {
      url,
      ...(authToken && { authToken }),
    },
  });
};
