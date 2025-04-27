import { genStorageKey } from '../../utils';
import type { DBContext } from '../db';

export const putStorage = async ({ r2, bucketPrefix }: DBContext, blob: Blob) => {
  const [key, ab] = await genStorageKey(blob);

  const objKey = `${bucketPrefix}/${key}`;

  const res = await r2.head(objKey);
  if (res) {
    return key;
  }

  await r2.put(objKey, ab, {
    httpMetadata: {
      contentType: blob.type,
    },
  });

  return key;
};
