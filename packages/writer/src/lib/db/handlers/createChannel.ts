import { db } from '$lib/db/client';
import { channelsTable, usersTable } from '$lib/db/schema';
import { storeFile } from '$lib/file/storeFile';
import { sql } from 'drizzle-orm';

export const createChannel = async (
  userID: string,
  channelID: string,
  title: string,
  desc?: string | null,
  icon?: File | null,
) => {
  const iconHash = icon && (await storeFile(icon));

  await db.batch([
    db.insert(channelsTable).values({ channelID, title, desc, icon: iconHash, owners: [userID] }),
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
