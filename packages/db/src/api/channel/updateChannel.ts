import { and, eq, exists } from 'drizzle-orm';

import { db } from '../../client';
import { channelsTable, ownersTable } from '../../schema';
import { makeInsertBlob } from '../blob/makeInsertBlob';

export const updateChannel = async ({
  userID,
  updatedAt,
  channelID,
  name,
  desc,
  iconFile,
}: {
  userID: string;
  updatedAt: Date;
  channelID: string;
  name: string;
  desc?: string | undefined;
  iconFile?: Blob | 'remove' | undefined;
}) => {
  const [icon, iconInsert] =
    iconFile instanceof Blob ? await makeInsertBlob(iconFile) : [null, undefined];

  await db.batch([
    db
      .update(channelsTable)
      .set({
        name,
        desc: desc ?? null,
        ...(iconFile !== undefined && { icon }),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(channelsTable.channelID, channelID),
          eq(channelsTable.updatedAt, updatedAt),
          exists(
            db
              .select()
              .from(ownersTable)
              .where(and(eq(ownersTable.channelID, channelID), eq(ownersTable.userID, userID))),
          ),
        ),
      ),
    ...(iconInsert ? [iconInsert] : []),
  ]);
};
