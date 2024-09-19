import { count, eq } from 'drizzle-orm';

import { db } from '../../client';
import { channelsTable, ownersTable } from '../../schema';
import { makeInsertBlob } from '../blob/makeInsertBlob';

export const createChannel = async (
  userID: string,
  channelID: string,
  name: string,
  desc: string | undefined,
  iconFile: Blob | undefined,
) => {
  const [icon, iconInsert] = iconFile ? await makeInsertBlob(iconFile) : [null, undefined];

  {
    // This should ideally be enforced by a database trigger.
    const c = (
      await db.select({ count: count() }).from(ownersTable).where(eq(ownersTable.userID, userID))
    ).shift();
    if (c && c.count >= 5) {
      return;
    }
  }

  const queries = [
    db.insert(channelsTable).values({ channelID, name, desc: desc ?? null, icon }),
    db.insert(ownersTable).values({ channelID, userID }),
    ...(iconInsert ? [iconInsert] : []),
  ] as const;

  await db.batch(queries);
};
