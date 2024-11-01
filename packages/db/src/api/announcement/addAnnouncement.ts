import { and, eq } from 'drizzle-orm';

import { getDB } from '../../client';
import { announcementsTable, channelsTable } from '../../schema';
import { makeInsertBlob } from '../blob/makeInsertBlob';
import { getChannel } from '../channel/getChannel';
import { genAnnouncementID } from './genAnnouncementID';

import * as v from 'valibot';
import {
  ANNOUNCEMENT_BODY_MAX_BYTES,
  ANNOUNCEMENT_IMAGE_MAX_BYTES,
  ANNOUNCEMENT_TITLE_MAX_BYTES,
  CHANNEL_ID_MAX_BYTES,
  USER_ID_MAX_BYTES,
} from '../../constants';

const paramsSchema = v.object({
  userID: v.pipe(v.string(), v.nonEmpty(), v.maxBytes(USER_ID_MAX_BYTES)),
  channelID: v.pipe(v.string(), v.nonEmpty(), v.maxBytes(CHANNEL_ID_MAX_BYTES)),
  headerImage: v.union([v.pipe(v.blob(), v.maxSize(ANNOUNCEMENT_IMAGE_MAX_BYTES)), v.undefined()]),
  title: v.union([v.pipe(v.string(), v.maxBytes(ANNOUNCEMENT_TITLE_MAX_BYTES)), v.undefined()]),
  body: v.pipe(v.string(), v.nonEmpty(), v.maxBytes(ANNOUNCEMENT_BODY_MAX_BYTES)),
  images: v.union([
    v.array(v.pipe(v.blob(), v.maxSize(ANNOUNCEMENT_IMAGE_MAX_BYTES))),
    v.undefined(),
  ]),
  createdAt: v.number(),
});

type Params = v.InferOutput<typeof paramsSchema>;

export const addAnnouncement = async (params: Params) => {
  v.assert(paramsSchema, params);

  const { userID, channelID, headerImage, title, body, images, createdAt } = params;

  const channel = await getChannel({ userID, channelID });
  if (!channel) {
    return;
  }

  const queries = [];

  const values: Omit<typeof announcementsTable.$inferInsert, 'announcementID'> = {
    userID,
    channelID,
    body,
    updatedAt: createdAt,
    createdAt,
  };

  if (title) {
    values.title = title;
  }

  if (headerImage) {
    const [v, q] = await makeInsertBlob(headerImage);
    values.headerImage = v;
    queries.push(q);
  }

  if (images) {
    const a = [];
    for (const f of images) {
      const [v, q] = await makeInsertBlob(f);
      a.push(v);
      queries.push(q);
    }
    values.images = a;
  }

  const announcementID = genAnnouncementID(values);

  const db = getDB();

  queries.push(db.insert(announcementsTable).values({ announcementID, ...values }));

  const announcementIDs = [announcementID, ...(channel.announcementIDs ?? [])];

  const updateChannel = db
    .update(channelsTable)
    .set({
      announcementIDs,
      updatedAt: new Date().getTime(),
    })
    .where(
      and(eq(channelsTable.channelID, channelID), eq(channelsTable.updatedAt, channel.updatedAt)),
    );

  await db.batch([updateChannel, ...queries]);
};
