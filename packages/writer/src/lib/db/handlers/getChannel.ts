import { db } from '$lib/db/client';
import { channelOwnersTable, channelsTable } from '$lib/db/schema';
import { and, eq, inArray } from 'drizzle-orm';

export const getChannel = async (userID: string | undefined, channelID: number) => {
  if (!userID) return;

  if (isNaN(channelID)) return;

  const ownedChannels = db
    .select({ channelID: channelOwnersTable.channelID })
    .from(channelOwnersTable)
    .where(eq(channelOwnersTable.userID, userID));

  return (
    await db
      .select()
      .from(channelsTable)
      .where(
        and(
          eq(channelsTable.channelID, channelID),
          inArray(channelsTable.channelID, ownedChannels),
        ),
      )
  ).shift();
};
