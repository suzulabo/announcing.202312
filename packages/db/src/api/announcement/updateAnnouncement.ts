import { and, eq } from 'drizzle-orm';

import * as v from 'valibot';
import { getDB } from '../../client';
import {
  ANNOUNCEMENT_BODY_MAX_BYTES,
  ANNOUNCEMENT_ID_SIZE,
  ANNOUNCEMENT_IMAGE_MAX_BYTES,
  ANNOUNCEMENT_TITLE_MAX_BYTES,
  BLOB_ID_MAX_BYTES,
  CHANNEL_ID_MAX_BYTES,
  USER_ID_MAX_BYTES,
} from '../../constants';
import { announcementsTable, channelsTable } from '../../schema';
import { makeInsertBlob } from '../blob/makeInsertBlob';
import { getChannel } from '../channel/getChannel';
import { genAnnouncementID } from './genAnnouncementID';

const paramsSchema = v.object({
  userID: v.pipe(v.string(), v.nonEmpty(), v.maxBytes(USER_ID_MAX_BYTES)),
  channelID: v.pipe(v.string(), v.nonEmpty(), v.maxBytes(CHANNEL_ID_MAX_BYTES)),
  targetAnnouncementID: v.pipe(v.string(), v.nonEmpty(), v.maxBytes(ANNOUNCEMENT_ID_SIZE)),
  targetUpdatedAt: v.number(),
  headerImage: v.union([
    v.pipe(
      v.blob(),
      v.mimeType(['image/jpeg', 'image/png', 'image/webp']),
      v.maxSize(ANNOUNCEMENT_IMAGE_MAX_BYTES),
    ),
    v.pipe(v.string(), v.nonEmpty(), v.maxBytes(BLOB_ID_MAX_BYTES)),
    v.undefined(),
  ]),
  title: v.union([v.pipe(v.string(), v.maxBytes(ANNOUNCEMENT_TITLE_MAX_BYTES)), v.undefined()]),
  body: v.pipe(v.string(), v.nonEmpty(), v.maxBytes(ANNOUNCEMENT_BODY_MAX_BYTES)),
  images: v.union([
    v.array(
      v.union([
        v.pipe(
          v.blob(),
          v.mimeType(['image/jpeg', 'image/png', 'image/webp']),
          v.maxSize(ANNOUNCEMENT_IMAGE_MAX_BYTES),
        ),
        v.pipe(v.string(), v.nonEmpty(), v.maxBytes(BLOB_ID_MAX_BYTES)),
      ]),
    ),
    v.undefined(),
  ]),
});

type Params = v.InferOutput<typeof paramsSchema>;

export const updateAnnouncement = async (params: Params) => {
  v.assert(paramsSchema, params);

  const {
    userID,
    channelID,
    targetAnnouncementID,
    targetUpdatedAt,
    headerImage,
    title,
    body,
    images,
  } = params;

  const channel = await getChannel({ userID, channelID });
  if (!channel) {
    return;
  }
  const announcementIDs = channel.announcementIDs;
  if (!announcementIDs) {
    return;
  }
  const index = announcementIDs.indexOf(targetAnnouncementID);
  if (index < 0) {
    return;
  }

  const db = await getDB();

  const targetAnnouncement = (
    await db
      .select({
        title: announcementsTable.title,
        body: announcementsTable.body,
        headerImage: announcementsTable.headerImage,
        images: announcementsTable.images,
        createdAt: announcementsTable.createdAt,
      })
      .from(announcementsTable)
      .where(
        and(
          eq(announcementsTable.channelID, channelID),
          eq(announcementsTable.announcementID, targetAnnouncementID),
          eq(announcementsTable.updatedAt, targetUpdatedAt),
        ),
      )
  ).shift();

  if (!targetAnnouncement) {
    return;
  }

  const queries = [];
  const now = new Date().getTime();

  const values: Omit<typeof announcementsTable.$inferInsert, 'announcementID'> = {
    ...targetAnnouncement,
    userID,
    channelID,
    body,
    updatedAt: now,
  };

  if (title) {
    values.title = title;
  }

  if (!headerImage) {
    values.headerImage = null;
  } else if (typeof headerImage === 'string') {
    values.headerImage = headerImage;
  } else if (headerImage instanceof Blob) {
    const [v, q] = await makeInsertBlob(headerImage);
    values.headerImage = v;
    queries.push(q);
  }

  if (!images) {
    values.images = null;
  } else {
    const imagesValues = [];
    for (const image of images) {
      if (typeof image === 'string') {
        imagesValues.push(image);
      } else if (image instanceof Blob) {
        const [v, q] = await makeInsertBlob(image);
        imagesValues.push(v);
        queries.push(q);
      }
    }
    values.images = imagesValues;
  }

  const announcementID = genAnnouncementID(values);

  queries.push(db.insert(announcementsTable).values({ ...values, announcementID }));

  announcementIDs[index] = announcementID;

  const updateChannel = db
    .update(channelsTable)
    .set({
      announcementIDs,
      updatedAt: now,
    })
    .where(
      and(eq(channelsTable.channelID, channelID), eq(channelsTable.updatedAt, channel.updatedAt)),
    );

  const batchResults = await db.batch([updateChannel, ...queries]);
  if (batchResults[0].rowsAffected === 1) {
    await db
      .delete(announcementsTable)
      .where(
        and(
          eq(announcementsTable.channelID, channelID),
          eq(announcementsTable.announcementID, targetAnnouncementID),
        ),
      );
  }
};
