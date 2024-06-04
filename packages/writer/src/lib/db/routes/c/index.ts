import { db } from '$lib/db/client';
import { channelsTable } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

export const getChannel = async (id: number) => {
  if (isNaN(id)) {
    return;
  }

  return (await db.select().from(channelsTable).where(eq(channelsTable.channelID, id))).shift();
};
