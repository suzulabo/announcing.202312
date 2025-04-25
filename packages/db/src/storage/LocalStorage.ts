import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { genStorageKey } from '../utils/genStorageKey';
import type { Storage } from './storage';

const STORAGE_DIR = '../db-local/storage';

export const createLocalStorage = (): Storage => {
  const get = async (key: string) => {
    try {
      const res = await readFile(`${STORAGE_DIR}/${key}`);
      return {
        contentType: '',
        data: res,
      };
    } catch (err: unknown) {
      if (err instanceof Error && 'code' in err) {
        if (err.code === 'ENOENT') {
          return;
        }
      }
      throw err;
    }
  };

  const put = async (blob: Blob) => {
    const [key, ab] = await genStorageKey(blob);
    await mkdir(STORAGE_DIR, { recursive: true });
    await writeFile(`${STORAGE_DIR}/${key}`, ab);
    return key;
  };

  return {
    get,
    put,
  };
};
