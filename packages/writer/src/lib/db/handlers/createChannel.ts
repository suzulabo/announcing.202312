import { db } from '$lib/db/client';
import { channelsTable, usersTable } from '$lib/db/schema';
import { storeFile } from '$lib/file/storeFile';
import { sql } from 'drizzle-orm';

export const createChannel = async (
  userID: string,
  channelID: string,
  title: string,
  desc: string | null | undefined,
  iconFile: File | null | undefined,
) => {
  const icon = (iconFile && (await storeFile(iconFile))) ?? null;

  await db.batch([
    db.insert(channelsTable).values({ channelID, title, desc, icon, owners: [userID] }),
    db
      .insert(usersTable)
      .values({ userID, channels: [channelID] })
      .onConflictDoUpdate({
        target: usersTable.userID,
        set: {
          channels: sql`json_insert(channels, '$[#]', ${channelID})`,
        },
      }),
  ]);
};
