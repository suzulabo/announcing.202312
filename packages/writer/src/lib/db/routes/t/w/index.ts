import { db } from '$lib/db/client';
import { channelOwnersTable, channelsTable } from '$lib/db/schema';
import storeFile from '$lib/file/storeFile';
import { and, eq, inArray } from 'drizzle-orm';

export const createChannel = async (
  userID: string,
  channelID: number,
  title: string,
  desc?: string | null,
  icon?: File | null,
) => {
  const iconHash = icon && (await storeFile(icon));

  await db.batch([
    db.insert(channelsTable).values({ channelID, title, desc, icon: iconHash }),
    db.insert(channelOwnersTable).values({ userID, channelID }),
  ]);
};

export const updateChannel = async (
  userID: string,
  updatedAt: Date,
  channelID: number,
  title: string,
  desc?: string | null,
  icon?: File | null,
) => {
  const iconHash = (icon && (await storeFile(icon))) || undefined;

  const channelIDs = db
    .select({ channelID: channelOwnersTable.channelID })
    .from(channelOwnersTable)
    .where(eq(channelOwnersTable.userID, userID));

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
        inArray(channelsTable.channelID, channelIDs),
        eq(channelsTable.updatedAt, updatedAt),
      ),
    );

  return result.rowsAffected;
};
