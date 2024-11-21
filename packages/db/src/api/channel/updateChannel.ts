import { and, eq, exists } from 'drizzle-orm';
import type { SQLiteUpdateSetSource } from 'drizzle-orm/sqlite-core';

import { channelsTable, ownersTable } from '../../schema';
import { getDB } from '../db';

import * as v from 'valibot';
import {
  BLOB_ID_MAX_BYTES,
  CHANNEL_DESC_MAX_BYTES,
  CHANNEL_ICON_MAX_BYTES,
  CHANNEL_ID_MAX_BYTES,
  CHANNEL_NAME_MAX_BYTES,
  USER_ID_MAX_BYTES,
} from '../../lib/constants';
import { putStorageData } from '../../storage/storage';

const paramsSchema = v.object({
  userID: v.pipe(v.string(), v.nonEmpty(), v.maxBytes(USER_ID_MAX_BYTES)),
  updatedAt: v.number(),
  channelID: v.pipe(v.string(), v.nonEmpty(), v.maxBytes(CHANNEL_ID_MAX_BYTES)),
  name: v.pipe(v.string(), v.nonEmpty(), v.maxBytes(CHANNEL_NAME_MAX_BYTES)),
  desc: v.union([v.pipe(v.string(), v.maxBytes(CHANNEL_DESC_MAX_BYTES)), v.undefined()]),
  icon: v.union([
    v.pipe(
      v.blob(),
      v.mimeType(['image/jpeg', 'image/png', 'image/webp']),
      v.maxSize(CHANNEL_ICON_MAX_BYTES),
    ),
    v.pipe(v.string(), v.nonEmpty(), v.maxBytes(BLOB_ID_MAX_BYTES)),
    v.undefined(),
  ]),
});

type Params = v.InferOutput<typeof paramsSchema>;

export const updateChannel = async (params: Params) => {
  v.assert(paramsSchema, params);

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
    values.icon = await putStorageData(icon);
  }

  const db = getDB();

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
