import { and, eq } from 'drizzle-orm';

import { putStorageData } from '../../storage/storage';
import { getChannel } from '../channel/getChannel';
import { getDB } from '../db';
import { announcementsTable, channelsTable } from '../schema';
import { genAnnouncementID } from './genAnnouncementID';

type Params = {
  userID: string;
  channelID: string;
  targetAnnouncementID: string;
  targetUpdatedAt: number;
  headerImage?: string | Blob | undefined;
  title?: string | undefined;
  body: string;
  images?: (string | Blob)[] | undefined;
};

export const updateAnnouncement = async (params: Params) => {
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

  const db = getDB();

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

  const storagePuts = [];

  if (!headerImage) {
    values.headerImage = null;
  } else if (typeof headerImage === 'string') {
    values.headerImage = headerImage;
  } else if (headerImage instanceof Blob) {
    storagePuts.push(
      putStorageData(headerImage).then((v) => {
        values.headerImage = v;
      }),
    );
  }

  if (!images) {
    values.images = null;
  } else {
    const a: string[] = [];
    values.images = a;
    images.forEach((image, i) => {
      if (typeof image === 'string') {
        a[i] = image;
      } else if (image instanceof Blob) {
        storagePuts.push(
          putStorageData(image).then((v) => {
            a[i] = v;
          }),
        );
      }
    });
  }

  await Promise.all(storagePuts);

  const announcementID = genAnnouncementID(values);

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

  const batchResults = await db.batch([
    updateChannel,
    db.insert(announcementsTable).values({ ...values, announcementID }),
  ]);
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
