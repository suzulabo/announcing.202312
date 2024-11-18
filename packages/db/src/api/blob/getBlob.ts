import { eq } from 'drizzle-orm';

import { blobsTable } from '../../schema';
import { getDB } from '../db';

export const getBlob = async (blobID: string) => {
  const db = getDB();

  const blob = (await db.select().from(blobsTable).where(eq(blobsTable.blobID, blobID))).shift();
  if (!blob) {
    return;
  }

  return {
    contentType: blob.contentType,
    // D1 driver returns Array
    data: Buffer.from(blob.data),
  };
};
