import { db } from '$lib/db/client';
import { threadOwnersTable, threadsTable } from '$lib/db/schema';
import storeFile from '$lib/file/storeFile';

export const createThread = async (
  userID: string,
  threadID: number,
  title: string,
  desc?: string,
  icon?: File,
) => {
  const iconHash = icon && (await storeFile(icon));

  await db.batch([
    db.insert(threadsTable).values({ threadID, title, desc, icon: iconHash }),
    db.insert(threadOwnersTable).values({ userID, threadID }),
  ]);
};
