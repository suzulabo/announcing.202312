import { dev } from '$app/environment';
import bsx from 'base-x';
import { createHash } from 'crypto';
import { writeFile } from 'fs/promises';

export const bs62 = bsx('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

const getHash = async (file: File) => {
  const ab = new Uint8Array(await file.arrayBuffer());

  const digest = createHash('sha256').update(ab).digest();

  const hash = bs62.encode(digest);

  return [hash, ab] as const;
};

const storeFileLocal = async (file: File) => {
  const [hash, ab] = await getHash(file);

  await Promise.all([
    writeFile(`storage/${hash}`, ab, { flag: 'wx' }),
    writeFile(`storage/${hash}.meta`, JSON.stringify({ name: file.name, type: file.type }), {
      flag: 'wx',
    }),
  ]);
};

const storeFileD1 = async (file: File) => {
  console.log(file);
};

const storeFile = dev ? storeFileLocal : storeFileD1;

export default storeFile;
