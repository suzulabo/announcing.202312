import { db } from '$lib/db/client';
import { threadOwnersTable, threadsTable } from '$lib/db/schema';
import { eq, inArray } from 'drizzle-orm';

export const getThreads = async (userID: string | undefined) => {
  if (!userID) return [];

  const threadIDs = db
    .select({ threadID: threadOwnersTable.threadID })
    .from(threadOwnersTable)
    .where(eq(threadOwnersTable.userID, userID));

  const threads = await db
    .select({
      threadID: threadsTable.threadID,
      title: threadsTable.title,
      icon: threadsTable.icon,
      updatedAt: threadsTable.updatedAt,
    })
    .from(threadsTable)
    .where(inArray(threadsTable.threadID, threadIDs));

  return { threads };
};
