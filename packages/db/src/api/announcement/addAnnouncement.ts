import { and, eq } from 'drizzle-orm';

import { db } from '../../client';
import { channelsTable } from '../../schema';
import { getChannel } from '../channel/getChannel';
import { makeInsertAnnouncement } from './makeInsertAnnouncement';

export const addAnnouncement = async (
  userID: string,
  channelID: string,
  headerImageFile: Blob | undefined,
  title: string | undefined,
  body: string,
  imagesFiles: Blob[] | undefined,
  createdAt: Date,
) => {
  const channel = await getChannel(userID, channelID);
  if (!channel) {
    return;
  }

  const { announcementID, announcementQueries } = await makeInsertAnnouncement(
    userID,
    channelID,
    headerImageFile,
    title,
    body,
    imagesFiles,
    createdAt,
    createdAt,
  );

  const announcementIDs = channel.announcementIDs ?? [];
  announcementIDs.push(announcementID);

  const queries = [
    ...announcementQueries,
    db
      .update(channelsTable)
      .set({
        announcementIDs,
        updatedAt: new Date(),
      })
      .where(
        and(eq(channelsTable.channelID, channelID), eq(channelsTable.updatedAt, channel.updatedAt)),
      ),
  ] as const;

  await db.batch(queries);
};
