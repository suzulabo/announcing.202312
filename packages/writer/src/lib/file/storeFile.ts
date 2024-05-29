import { dev } from '$app/environment';
import base62 from '$lib/utils/base62';
import { createHash } from 'crypto';
import { writeFile } from 'fs/promises';

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
      writeFile(`storage/${hash}`, ab, { flag: 'wx' }),
      writeFile(`storage/${hash}.meta`, JSON.stringify({ name: file.name, type: file.type }), {
        flag: 'wx',
      }),
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

const storeFileD1 = async (file: File) => {
  console.log(file);

  return '';
};

const storeFile = dev ? storeFileLocal : storeFileD1;

export default storeFile;
