import { createHash } from 'crypto';

import { base62 } from '../../lib/base62';
import { blobsTable } from '../../schema';
import { getDB } from '../db';

// TODO
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const imageSize = (_: unknown) => {
  return {
    width: 0,
    height: 0,
    type: '',
  };
};

const getHash = async (blob: Blob) => {
  const ab = new Uint8Array(await blob.arrayBuffer());

  const digest = createHash('sha256').update(ab).digest();

  const hash = base62.encode(new Uint8Array(digest));

  const size = imageSize(ab);
  if (size.type) {
    return [`${hash}_${size.width}x${size.height}.${size.type}`, ab] as const;
  } else {
    return [`${hash}_${size.width}x${size.height}`, ab] as const;
  }
};

export const makeInsertBlob = async (blob: Blob) => {
  const [blobID, ab] = await getHash(blob);

  const db = getDB();

  return [
    blobID,
    db
      .insert(blobsTable)
      .values({
        blobID,
        contentType: blob.type,
        data: Buffer.from(ab),
        createdAt: new Date().getTime(),
      })
      .onConflictDoNothing(),
  ] as const;
};

export type BlobInsertQuery = Awaited<ReturnType<typeof makeInsertBlob>>[1];
