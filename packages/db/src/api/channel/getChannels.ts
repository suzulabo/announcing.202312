import { eq } from 'drizzle-orm';

import { db } from '../../client';
import { getEnv } from '../../lib/env';
import { channelsTable, ownersTable } from '../../schema';

export const getChannels = async ({ userID }: { userID: string }) => {
  const channels = await db
    .select({
      channelID: channelsTable.channelID,
      name: channelsTable.name,
      desc: channelsTable.desc,
      icon: channelsTable.icon,
      announcementIDs: channelsTable.icon,
      updatedAt: channelsTable.updatedAt,
      createdAt: channelsTable.createdAt,
    })
    .from(channelsTable)
    .innerJoin(ownersTable, eq(channelsTable.channelID, ownersTable.channelID))
    .where(eq(ownersTable.userID, userID));

  const { imagePrefix } = getEnv();

  return channels.map((channel) => {
    return {
      ...channel,
      desc: channel.desc ?? undefined,
      icon: channel.icon ? `${imagePrefix}${channel.icon}` : undefined,
      announcementIDs: channel.announcementIDs ?? undefined,
    };
  });
};
