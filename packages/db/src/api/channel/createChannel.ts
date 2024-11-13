import { count, eq } from 'drizzle-orm';

import * as v from 'valibot';
import { getDB } from '../../client';
import {
  CHANNEL_DESC_MAX_BYTES,
  CHANNEL_ICON_MAX_BYTES,
  CHANNEL_ID_MAX_BYTES,
  CHANNEL_NAME_MAX_BYTES,
  USER_ID_MAX_BYTES,
} from '../../constants';
import { channelsTable, ownersTable } from '../../schema';
import { makeInsertBlob } from '../blob/makeInsertBlob';

const paramsSchema = v.object({
  userID: v.pipe(v.string(), v.nonEmpty(), v.maxBytes(USER_ID_MAX_BYTES)),
  channelID: v.pipe(v.string(), v.nonEmpty(), v.maxBytes(CHANNEL_ID_MAX_BYTES)),
  name: v.pipe(v.string(), v.nonEmpty(), v.maxBytes(CHANNEL_NAME_MAX_BYTES)),
  desc: v.union([v.pipe(v.string(), v.maxBytes(CHANNEL_DESC_MAX_BYTES)), v.undefined()]),
  icon: v.union([
    v.pipe(
      v.blob(),
      v.mimeType(['image/jpeg', 'image/png', 'image/webp']),
      v.maxSize(CHANNEL_ICON_MAX_BYTES),
    ),
    v.undefined(),
  ]),
});

type Params = v.InferOutput<typeof paramsSchema>;

export const createChannel = async (params: Params) => {
  v.assert(paramsSchema, params);

  const { userID, channelID, name, desc, icon } = params;

  const db = getDB();

  {
    // This should ideally be enforced by a database trigger.
    const c = (
      await db.select({ count: count() }).from(ownersTable).where(eq(ownersTable.userID, userID))
    ).shift();
    if (c && c.count >= 5) {
      return;
    }
  }

  const now = new Date().getTime();
  const queries = [];

  const values: typeof channelsTable.$inferInsert = {
    channelID,
    name,
    desc: desc ?? null,
    updatedAt: now,
    createdAt: now,
  };

  if (icon) {
    const [v, q] = await makeInsertBlob(icon);
    values.icon = v;
    queries.push(q);
  }

  queries.push(db.insert(ownersTable).values({ channelID, userID, createdAt: now }));

  await db.batch([db.insert(channelsTable).values(values), ...queries]);
};
