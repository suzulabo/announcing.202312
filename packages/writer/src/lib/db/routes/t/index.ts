import { db } from '$lib/db/client';
import { threadsTable } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

export const getThread = async (id: number) => {
  if (isNaN(id)) {
    return;
  }

  return (await db.select().from(threadsTable).where(eq(threadsTable.threadID, id))).shift();
};
