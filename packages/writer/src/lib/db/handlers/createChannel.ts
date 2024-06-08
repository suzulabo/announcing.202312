import { db } from '$lib/db/client';
import { channelOwnersTable, channelsTable } from '$lib/db/schema';
import { storeFile } from '$lib/file/storeFile';

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
