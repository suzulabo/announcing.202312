import { createHash } from 'crypto';

import { db } from '../../client';
import { base62 } from '../../lib/base62';
import { blobsTable } from '../../schema';

const getHash = async (blob: Blob) => {
  const ab = await blob.arrayBuffer();

  const digest = createHash('sha256').update(new Uint8Array(ab)).digest();

  const hash = base62.encode(new Uint8Array(digest));

  return [hash, ab] as const;
};

export const makeInsertBlob = async (blob: Blob) => {
  const [blobID, ab] = await getHash(blob);

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
