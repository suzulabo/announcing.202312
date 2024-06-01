import { db } from '$lib/db/client';
import { threadOwnersTable, threadsTable } from '$lib/db/schema';
import storeFile from '$lib/file/storeFile';
import { and, eq, inArray } from 'drizzle-orm';

export const createThread = async (
  userID: string,
  threadID: number,
  title: string,
  desc?: string | null,
  icon?: File | null,
) => {
  const iconHash = icon && (await storeFile(icon));

  await db.batch([
    db.insert(threadsTable).values({ threadID, title, desc, icon: iconHash }),
    db.insert(threadOwnersTable).values({ userID, threadID }),
  ]);
};

export const updateThread = async (
  userID: string,
  updatedAt: Date,
  threadID: number,
  title: string,
  desc?: string | null,
  icon?: File | null,
) => {
  const iconHash = (icon && (await storeFile(icon))) || undefined;

  const threadIDs = db
    .select({ threadID: threadOwnersTable.threadID })
    .from(threadOwnersTable)
    .where(eq(threadOwnersTable.userID, userID));

  const result = await db
    .update(threadsTable)
    .set({
      title,
      desc,
      icon: iconHash,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(threadsTable.threadID, threadID),
        inArray(threadsTable.threadID, threadIDs),
        eq(threadsTable.updatedAt, updatedAt),
      ),
    );

  return result.rowsAffected;
};
