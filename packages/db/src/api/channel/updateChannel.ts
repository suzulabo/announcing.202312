import { and, eq, exists } from 'drizzle-orm';
import type { SQLiteUpdateSetSource } from 'drizzle-orm/sqlite-core';

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
  updatedAt: number;
  channelID: string;
  name: string;
  desc?: string | undefined;
  iconFile?: Blob | 'remove' | undefined;
}) => {
  const queries = [];

  const values: SQLiteUpdateSetSource<typeof channelsTable> = {
    name,
    desc: desc ?? null,
    updatedAt: new Date().getTime(),
  };
  if (iconFile) {
    if (iconFile === 'remove') {
      values.icon = null;
    } else {
      const [v, q] = await makeInsertBlob(iconFile);
      values.icon = v;
      queries.push(q);
    }
  }

  await db.batch([
    db
      .update(channelsTable)
      .set(values)
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
    ...queries,
  ]);
};
