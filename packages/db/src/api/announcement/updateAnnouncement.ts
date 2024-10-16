import { and, eq } from 'drizzle-orm';

import { getDB } from '../../client';
import { announcementsTable, channelsTable } from '../../schema';
import { makeInsertBlob } from '../blob/makeInsertBlob';
import { getChannel } from '../channel/getChannel';
import { genAnnouncementID } from './genAnnouncementID';

export const updateAnnouncement = async ({
  userID,
  channelID,
  targetAnnouncementID,
  targetUpdatedAt,
  headerImage,
  title,
  body,
  images,
}: {
  userID: string;
  channelID: string;
  targetAnnouncementID: string;
  targetUpdatedAt: number;
  headerImage: Blob | string | undefined;
  title: string | undefined;
  body: string;
  images: (Blob | string)[] | undefined;
}) => {
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
        images.push(v);
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
