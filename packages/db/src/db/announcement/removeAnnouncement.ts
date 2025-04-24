import { and, eq } from 'drizzle-orm';
import type { LibSQLDatabase } from 'drizzle-orm/libsql';
import { getChannel } from '../channel/getChannel';
import { announcementsTable, channelsTable } from '../schema';
import { getAnnouncement } from './getAnnouncement';

export const removeAnnouncement = async (
  db: LibSQLDatabase,
  {
    userID,
    channelID,
    targetAnnouncementID,
    targetUpdatedAt,
  }: {
    userID: string;
    channelID: string;
    targetAnnouncementID: string;
    targetUpdatedAt: number;
  },
) => {
  const channel = await getChannel(db, { userID, channelID });
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

  {
    const announcement = await getAnnouncement(db, {
      channelID,
      announcementID: targetAnnouncementID,
    });
    if (!announcement) {
      return;
    }
    if (announcement.updatedAt !== targetUpdatedAt) {
      return;
    }
  }

  announcementIDs.splice(index, 1);

  const result = await db
    .update(channelsTable)
    .set({
      announcementIDs,
      updatedAt: new Date().getTime(),
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
