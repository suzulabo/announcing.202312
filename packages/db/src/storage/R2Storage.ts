import type { R2Bucket } from '@cloudflare/workers-types';
import { genStorageKey } from '../utils/genStorageKey';
import type { Storage } from './storage';

export const createR2Storage = (bucket: R2Bucket, prefix = ''): Storage => {
  const get = async (key: string) => {
    const res = await bucket.get(`${prefix}/${key}`);
    if (!res) {
      return;
    }

    return {
      contentType: res.httpMetadata?.contentType ?? '',
      data: new Uint8Array(await res.arrayBuffer()),
    };
  };

  const put = async (blob: Blob) => {
    const [key, ab] = await genStorageKey(blob);

    const objKey = `${prefix}/${key}`;

    const res = await bucket.head(objKey);
    if (res) {
      return key;
    }

    await bucket.put(objKey, ab, {
      httpMetadata: {
        contentType: blob.type,
      },
    });

    return key;
  };

  return { get, put };
};
