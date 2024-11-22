import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { getStorageKey } from './getStorageKey';
import type { Storage } from './storage';

export const createLocalStorage = (): Storage => {
  const get = (key: string) => {
    try {
      const res = readFileSync(`../db-dev/storage/${key}`);
      return Promise.resolve({
        contentType: '',
        data: res,
      });
    } catch (err: unknown) {
      if (err instanceof Error && 'code' in err) {
        if (err.code === 'ENOENT') {
          return Promise.resolve(undefined);
        }
      }
      throw err;
    }
  };

  const put = async (blob: Blob) => {
    const [key, ab] = await getStorageKey(blob);

    mkdirSync('../db-dev/storage', { recursive: true });
    writeFileSync(`../db-dev/storage/${key}`, ab);

    return key;
  };

  return {
    get,
    put,
  };
};
