import { eq } from 'drizzle-orm';

import { db } from '../../client';
import { channelsTable } from '../../schema';

export const READER = Symbol('READER');

export const getChannel = async (userID: typeof READER | string | undefined, channelID: string) => {
  if (!userID) return;

  const channel = (
    await db.select().from(channelsTable).where(eq(channelsTable.channelID, channelID))
  ).shift();

  if (!channel) return;

  if (userID !== READER) {
    if (!channel.owners.includes(userID)) return;
  }

  return channel;
};
