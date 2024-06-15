import { db } from '$lib/db/client';
import { channelsTable } from '$lib/db/schema';
import { storeFile } from '$lib/file/storeFile';
import { and, eq, sql } from 'drizzle-orm';

export const updateChannel = async (
  userID: string,
  updatedAt: Date,
  channelID: string,
  title: string,
  desc: string | null | undefined,
  iconFile: File | null | undefined,
) => {
  const icon = (iconFile && (await storeFile(iconFile))) || null;

  const result = await db
    .update(channelsTable)
    .set({
      title,
      desc,
      icon,
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
