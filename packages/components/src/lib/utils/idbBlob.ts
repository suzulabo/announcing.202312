import { kvsIndexedDB } from '@kvs/indexeddb';

import { base62 } from './base62';

const getDB = () => {
  return kvsIndexedDB<Record<string, Blob>>({
    name: 'blobs',
    version: 1,
  });
};

export const saveBlob = async (blob: Blob) => {
  const arrayBuffer = await blob.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const key = base62.encode(new Uint8Array(hashBuffer));

  const db = await getDB();
  await db.set(key, blob);

  return `idb://${key}`;
};

export const loadBlob = async (id: string) => {
  if (!id.startsWith('idb://')) {
    return;
  }
  const db = await getDB();
  const key = id.substring(6);
  return await db.get(key);
};
