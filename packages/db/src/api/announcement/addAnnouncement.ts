import { and, eq } from 'drizzle-orm';

import { announcementsTable, channelsTable } from '../../schema';
import { getChannel } from '../channel/getChannel';
import { getDB } from '../db';
import { genAnnouncementID } from './genAnnouncementID';

import * as v from 'valibot';
import {
  ANNOUNCEMENT_BODY_MAX_BYTES,
  ANNOUNCEMENT_IMAGE_MAX_BYTES,
  ANNOUNCEMENT_TITLE_MAX_BYTES,
  CHANNEL_ID_MAX_BYTES,
  USER_ID_MAX_BYTES,
} from '../../lib/constants';
import { putStorageData } from '../../storage/storage';

const paramsSchema = v.object({
  userID: v.pipe(v.string(), v.nonEmpty(), v.maxBytes(USER_ID_MAX_BYTES)),
  channelID: v.pipe(v.string(), v.nonEmpty(), v.maxBytes(CHANNEL_ID_MAX_BYTES)),
  headerImage: v.union([
    v.pipe(
      v.blob(),
      v.mimeType(['image/jpeg', 'image/png', 'image/webp']),
      v.maxSize(ANNOUNCEMENT_IMAGE_MAX_BYTES),
    ),
    v.undefined(),
  ]),
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

  const storagePuts = [];

  if (headerImage) {
    storagePuts.push(
      putStorageData(headerImage).then((v) => {
        values.headerImage = v;
      }),
    );
  }

  if (images) {
    const a: string[] = [];
    values.images = a;
    images.forEach((image, i) => {
      storagePuts.push(
        putStorageData(image).then((v) => {
          a[i] = v;
        }),
      );
    });
  }

  await Promise.all(storagePuts);

  const announcementID = genAnnouncementID(values);

  const db = getDB();

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

  await db.batch([
    updateChannel,
    db.insert(announcementsTable).values({ announcementID, ...values }),
  ]);
};
