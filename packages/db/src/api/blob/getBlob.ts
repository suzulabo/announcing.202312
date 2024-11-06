import { eq } from 'drizzle-orm';

import { getDB } from '../../client';
import { blobsTable } from '../../schema';

export const getBlob = async (blobID: string) => {
  const db = getDB();

  const blob = (await db.select().from(blobsTable).where(eq(blobsTable.blobID, blobID))).shift();
  if (!blob) {
    return;
  }

  return {
    contentType: blob.contentType,
    data: blob.data,
  };
};
