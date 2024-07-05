import { eq, inArray, sql } from 'drizzle-orm';

import { db } from '../../client';
import { channelsTable, usersTable } from '../../schema';

export const getChannels = async (userID: string | undefined) => {
  if (!userID) return [];

  const ownedChannels = db
    .select({ value: sql`json_each.value` })
    .from(sql`${usersTable}, json_each(${usersTable.channels})`)
    .where(eq(usersTable.userID, userID));

  const channels = await db
    .select({
      channelID: channelsTable.channelID,
      title: channelsTable.title,
      icon: channelsTable.icon,
      updatedAt: channelsTable.updatedAt,
    })
    .from(channelsTable)
    .where(inArray(channelsTable.channelID, ownedChannels));

  return channels;
};
