import { and, eq, exists } from 'drizzle-orm';
import type { SQLiteUpdateSetSource } from 'drizzle-orm/sqlite-core';
import { type Storage } from '../../storage/storage';
import type { DB } from '../db';
import { channelsTable, ownersTable } from '../schema';

type Params = {
  userID: string;
  updatedAt: number;
  channelID: string;
  name: string;
  desc?: string | undefined;
  icon?: string | Blob | undefined;
};

export const updateChannel = async (db: DB, storage: Storage, params: Params) => {
  const { userID, updatedAt, channelID, name, desc, icon } = params;

  const values: SQLiteUpdateSetSource<typeof channelsTable> = {
    name,
    desc: desc ?? null,
    updatedAt: new Date().getTime(),
  };

  if (!icon) {
    values.icon = null;
  } else if (typeof icon === 'string') {
    values.icon = icon;
  } else if (icon instanceof Blob) {
    values.icon = await storage.put(icon);
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
  ]);
};
