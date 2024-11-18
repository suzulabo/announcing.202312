import { and, eq } from 'drizzle-orm';

import { announcementsTable, channelsTable } from '../../schema';
import { getChannel } from '../channel/getChannel';
import { getDB } from '../db';
import { getAnnouncement } from './getAnnouncement';

export const removeAnnouncement = async ({
  userID,
  channelID,
  targetAnnouncementID,
  targetUpdatedAt,
}: {
  userID: string;
  channelID: string;
  targetAnnouncementID: string;
  targetUpdatedAt: number;
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

  {
    const announcement = await getAnnouncement({ channelID, announcementID: targetAnnouncementID });
    if (!announcement) {
      return;
    }
    if (announcement.updatedAt !== targetUpdatedAt) {
      return;
    }
  }

  announcementIDs.splice(index, 1);

  const db = getDB();

  const result = await db
    .update(channelsTable)
    .set({
      announcementIDs,
      updatedAt: new Date().getTime(),
    })
    .where(
      and(eq(channelsTable.channelID, channelID), eq(channelsTable.updatedAt, channel.updatedAt)),
    );

  if (result.meta.changes) {
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
