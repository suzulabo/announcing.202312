import { createHash } from 'crypto';

import { imageDimensionsFromData } from 'image-dimensions';
import imageType from 'image-type';
import { base62 } from '../../lib/base62';
import { blobsTable } from '../../schema';
import { getDB } from '../db';

const imageSize = async (ab: Uint8Array) => {
  const d = imageDimensionsFromData(ab);
  if (!d) {
    throw new Error('Can not get image size');
  }

  const t = await imageType(ab);

  return {
    width: d.width,
    height: d.height,
    ext: t?.ext,
  };
};

const getHash = async (blob: Blob) => {
  const ab = new Uint8Array(await blob.arrayBuffer());

  const digest = createHash('sha256').update(ab).digest();

  const hash = base62.encode(new Uint8Array(digest));

  const size = await imageSize(ab);
  if (size.ext) {
    return [`${hash}_${size.width}x${size.height}.${size.ext}`, ab] as const;
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
