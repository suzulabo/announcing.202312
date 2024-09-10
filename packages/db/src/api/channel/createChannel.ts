import { db } from '../../client';
import { channelsTable, ownersTable } from '../../schema';
import { makeInsertBlob } from '../blob/makeInsertBlob';

export const createChannel = async (
  userID: string,
  channelID: string,
  title: string,
  desc: string | undefined,
  iconFile: Blob | undefined,
) => {
  const [icon, iconInsert] = iconFile ? await makeInsertBlob(iconFile) : [null, undefined];

  const queries = [
    db.insert(channelsTable).values({ channelID, title, desc: desc ?? null, icon }),
    db.insert(ownersTable).values({ channelID, userID }),
    ...(iconInsert ? [iconInsert] : []),
  ] as const;

  await db.batch(queries);
};
