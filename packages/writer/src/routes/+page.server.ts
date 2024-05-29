import { db } from '$lib/db/client';
import { threadOwnersTable, threadsTable } from '$lib/db/schema';
import { eq, inArray } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.auth();

  const userID = session?.user?.id;

  if (!userID) return;

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
