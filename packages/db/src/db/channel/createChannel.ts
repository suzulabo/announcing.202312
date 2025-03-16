import { count, eq } from 'drizzle-orm';

import { putStorageData } from '../../storage/storage';
import { getDB } from '../db';
import { channelsTable, ownersTable } from '../schema';

type Params = {
  userID: string;
  channelID: string;
  name: string;
  desc?: string | undefined;
  icon?: Blob | undefined;
};

export const createChannel = async (params: Params) => {
  const { userID, channelID, name, desc, icon } = params;

  const db = getDB();

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

  const values: typeof channelsTable.$inferInsert = {
    channelID,
    name,
    desc: desc ?? null,
    updatedAt: now,
    createdAt: now,
  };

  if (icon) {
    values.icon = await putStorageData(icon);
  }

  await db.batch([
    db.insert(channelsTable).values(values),
    db.insert(ownersTable).values({ channelID, userID, createdAt: now }),
  ]);
};
