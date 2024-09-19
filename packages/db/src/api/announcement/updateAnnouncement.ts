import { and, eq } from 'drizzle-orm';

import { db } from '../../client';
import { announcementsTable, channelsTable } from '../../schema';
import { getChannel } from '../channel/getChannel';
import { getAnnouncement } from './getAnnouncement';
import { makeInsertAnnouncement } from './makeInsertAnnouncement';

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
  targetUpdatedAt: Date;
  headerImageFile: Blob | undefined;
  title: string | undefined;
  body: string;
  imagesFiles: Blob[] | undefined;
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

  const announcement = await getAnnouncement({ channelID, announcementID: targetAnnouncementID });
  if (!announcement || announcement.updatedAt !== targetUpdatedAt) {
    return;
  }

  const { announcementID, announcementQueries } = await makeInsertAnnouncement({
    userID,
    channelID,
    headerImageFile,
    title,
    body,
    imagesFiles,
    updatedAt: new Date(),
    createdAt: announcement.createdAt,
  });

  announcementIDs[index] = announcementID;

  const queries = [
    db
      .update(channelsTable)
      .set({
        announcementIDs,
        updatedAt: new Date(),
      })
      .where(
        and(eq(channelsTable.channelID, channelID), eq(channelsTable.updatedAt, channel.updatedAt)),
      ),
    ...announcementQueries,
  ] as const;

  const batchResults = await db.batch(queries);
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
