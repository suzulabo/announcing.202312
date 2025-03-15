import { migrate } from 'drizzle-orm/libsql/migrator';
import { getDB, setDBEnv } from '../src/db/db';
import { setStorage, type Storage } from '../src/storage/storage';

const createMemoryStorage = (): Storage => {
  let index = 1;
  const m = new Map<string, Blob>();

  const put = (blob: Blob) => {
    const key = index.toString();
    m.set(key, blob);
    index++;
    return Promise.resolve(key);
  };

  const get = async (key: string) => {
    const blob = m.get(key);
    if (blob) {
      return {
        contentType: blob.type,
        data: new Uint8Array(await blob.arrayBuffer()),
      };
    }
    return;
  };

  return {
    put,
    get,
  };
};

export const setupDB = async () => {
  setDBEnv({ url: ':memory:' });
  const db = getDB(true);
  await migrate(db, { migrationsFolder: './drizzle' });

  setStorage(createMemoryStorage());
};
