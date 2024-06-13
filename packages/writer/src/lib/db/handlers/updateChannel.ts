import { db } from '$lib/db/client';
import { channelsTable } from '$lib/db/schema';
import { storeFile } from '$lib/file/storeFile';
import { and, eq, sql } from 'drizzle-orm';

export const updateChannel = async (
  userID: string,
  updatedAt: Date,
  channelID: string,
  title: string,
  desc?: string | null,
  icon?: File | null,
) => {
  const iconHash = (icon && (await storeFile(icon))) || null;

  const result = await db
    .update(channelsTable)
    .set({
      title,
      desc,
      icon: iconHash,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(channelsTable.channelID, channelID),
        eq(channelsTable.updatedAt, updatedAt),
        sql`EXISTS(SELECT 1 FROM json_each(owners) WHERE value = ${userID})`,
      ),
    );

  return result.rowsAffected;
};
