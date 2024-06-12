import { db } from '$lib/db/client';
import { channelsTable } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

export const getChannel = async (userID: string | undefined, channelID: string) => {
  if (!userID) return;

  const channel = (
    await db.select().from(channelsTable).where(eq(channelsTable.channelID, channelID))
  ).shift();

  if (!channel) return;

  if (!channel.owners.includes(userID)) return;

  return channel;
};
