import { and, eq } from 'drizzle-orm';

import { db } from '../../client';
import { announcementsTable, channelsTable } from '../../schema';
import { makeInsertBlob } from '../blob/makeInsertBlob';
import { getChannel } from '../channel/getChannel';
import { genAnnouncementID } from './genAnnouncementID';

export const updateAnnouncement = async ({
  userID,
  channelID,
  targetAnnouncementID,
  targetUpdatedAt,
  headerImageFile,
  title,
  body,
  imagesFiles,
}: {
  userID: string;
  channelID: string;
  targetAnnouncementID: string;
  targetUpdatedAt: number;
  headerImageFile: Blob | 'remove' | undefined;
  title: string | undefined;
  body: string;
  imagesFiles: Blob[] | 'remove' | undefined;
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

  if (headerImageFile) {
    if (headerImageFile == 'remove') {
      values.headerImage = null;
    } else {
      const [v, q] = await makeInsertBlob(headerImageFile);
      values.headerImage = v;
      queries.push(q);
    }
  }

  if (imagesFiles) {
    if (imagesFiles === 'remove') {
      values.images = null;
    } else {
      const images = [];
      for (const f of imagesFiles) {
        const [v, q] = await makeInsertBlob(f);
        images.push(v);
        queries.push(q);
      }
      values.images = images;
    }
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
