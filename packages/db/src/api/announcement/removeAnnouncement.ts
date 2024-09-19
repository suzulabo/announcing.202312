import { and, eq } from 'drizzle-orm';

import { db } from '../../client';
import { announcementsTable, channelsTable } from '../../schema';
import { getChannel } from '../channel/getChannel';

export const removeAnnouncement = async ({
  userID,
  channelID,
  targetAnnouncementID,
}: {
  userID: string;
  channelID: string;
  targetAnnouncementID: string;
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

  announcementIDs.splice(index, 1);

  const result = await db
    .update(channelsTable)
    .set({
      announcementIDs,
      updatedAt: new Date(),
    })
    .where(
      and(eq(channelsTable.channelID, channelID), eq(channelsTable.updatedAt, channel.updatedAt)),
    );

  if (result.rowsAffected === 1) {
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
