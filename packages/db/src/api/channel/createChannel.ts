import { count, eq } from 'drizzle-orm';

import { db } from '../../client';
import { channelsTable, ownersTable } from '../../schema';
import { makeInsertBlob } from '../blob/makeInsertBlob';

export const createChannel = async ({
  userID,
  channelID,
  name,
  desc,
  icon,
}: {
  userID: string;
  channelID: string;
  name: string;
  desc: string | undefined;
  icon: Blob | undefined;
}) => {
  {
    // This should ideally be enforced by a database trigger.
    const c = (
      await db.select({ count: count() }).from(ownersTable).where(eq(ownersTable.userID, userID))
    ).shift();
    if (c && c.count >= 5) {
      return;
    }
  }

  const now = new Date().getTime();
  const queries = [];

  const values: typeof channelsTable.$inferInsert = {
    channelID,
    name,
    desc: desc ?? null,
    updatedAt: now,
    createdAt: now,
  };

  if (icon) {
    const [v, q] = await makeInsertBlob(icon);
    values.icon = v;
    queries.push(q);
  }

  queries.push(db.insert(ownersTable).values({ channelID, userID, createdAt: now }));

  await db.batch([db.insert(channelsTable).values(values), ...queries]);
};
