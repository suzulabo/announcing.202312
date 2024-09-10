import { eq } from 'drizzle-orm';

import { db } from '../../client';
import { channelsTable, ownersTable } from '../../schema';

export const getChannels = async (userID: string) => {
  const channels = await db
    .select({
      channelID: channelsTable.channelID,
      title: channelsTable.title,
      desc: channelsTable.desc,
      icon: channelsTable.icon,
      updatedAt: channelsTable.updatedAt,
      createdAt: channelsTable.createdAt,
    })
    .from(channelsTable)
    .innerJoin(ownersTable, eq(channelsTable.channelID, ownersTable.channelID))
    .where(eq(ownersTable.userID, userID));

  return channels.map((channel) => {
    return { ...channel, desc: channel.desc ?? undefined, icon: channel.icon ?? undefined };
  });
};
