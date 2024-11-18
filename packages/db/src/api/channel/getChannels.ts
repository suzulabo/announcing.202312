import { eq } from 'drizzle-orm';

import { channelsTable, ownersTable } from '../../schema';
import { getDB } from '../db';

export const getChannels = async ({ userID }: { userID: string }) => {
  const db = getDB();

  const start = performance.now();

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

  const end = performance.now();
  const duration = end - start;
  console.log(`[PERF-DB] getChannels - ${duration.toFixed(2)} ms`);

  return channels.map((channel) => {
    return {
      ...channel,
      desc: channel.desc ?? undefined,
      icon: channel.icon ?? undefined,
      announcementIDs: channel.announcementIDs ?? undefined,
    };
  });
};
