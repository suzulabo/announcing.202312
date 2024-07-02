import { createHash } from 'crypto';
import { writeFile } from 'fs/promises';
import { base62 } from './base62';
import { dev } from './env';

const getHash = async (file: File) => {
  const ab = new Uint8Array(await file.arrayBuffer());

  const digest = createHash('sha256').update(ab).digest();

  const hash = base62.encode(digest);

  return [hash, ab] as const;
};

const storeFileLocal = async (file: File) => {
  const [hash, ab] = await getHash(file);

  try {
    await Promise.all([
      writeFile(`../db-dev/storage/${hash}`, ab, { flag: 'wx' }),
      writeFile(
        `../db-dev/storage/${hash}.meta`,
        JSON.stringify({ name: file.name, type: file.type }),
        {
          flag: 'wx',
        },
      ),
    ]);
  } catch (err) {
    if (err instanceof Error && 'code' in err) {
      if (err.code === 'EEXIST') {
        return hash;
      }
    }

    throw err;
  }

  return hash;
};

const storeFileR2: typeof storeFileLocal = () => {
  throw new Error('Not yet implemented');
};

export const storeFile = dev ? storeFileLocal : storeFileR2;
