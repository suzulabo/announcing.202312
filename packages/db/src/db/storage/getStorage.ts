import type { DBContext } from '../db';

export const getStorage = async ({ r2, bucketPrefix }: DBContext, key: string) => {
  const res = await r2.get(`${bucketPrefix}/${key}`);
  if (!res) {
    return;
  }

  return {
    contentType: res.httpMetadata?.contentType ?? '',
    data: new Uint8Array(await res.arrayBuffer()),
  };
};
