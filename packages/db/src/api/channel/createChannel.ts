import { sql } from 'drizzle-orm';

import { db } from '../../client';
import { storeFile } from '../../lib/storeFile';
import { channelsTable, usersTable } from '../../schema';

export const createChannel = async (
  userID: string,
  channelID: string,
  title: string,
  desc: string | null,
  iconFile: Blob | null | undefined,
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
