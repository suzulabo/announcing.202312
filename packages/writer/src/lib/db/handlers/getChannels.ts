import { db } from '$lib/db/client';
import { channelOwnersTable, channelsTable } from '$lib/db/schema';
import { eq, inArray } from 'drizzle-orm';

export const getChannels = async (userID: string | undefined) => {
  if (!userID) return [];

  const ownedChannels = db
    .select({ channelID: channelOwnersTable.channelID })
    .from(channelOwnersTable)
    .where(eq(channelOwnersTable.userID, userID));

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
