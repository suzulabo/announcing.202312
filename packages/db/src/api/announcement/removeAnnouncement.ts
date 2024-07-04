import { and, eq, sql } from 'drizzle-orm';

import { db } from '../../client';
import { channelsTable } from '../../schema';

export const removeAnnouncement = async (
  userID: string,
  channelID: string,
  channelUpdatedAt: number,
  announcementID: string,
) => {
  const updatedAtDate = new Date(channelUpdatedAt);

  const channel = (
    await db
      .select({ announcements: channelsTable.announcements })
      .from(channelsTable)
      .where(
        and(
          eq(channelsTable.channelID, channelID),
          eq(channelsTable.updatedAt, updatedAtDate),
          sql`EXISTS(SELECT 1 FROM json_each(owners) WHERE value = ${userID})`,
        ),
      )
  ).shift();

  if (!channel) {
    return;
  }

  const nowDate = new Date();

  const announcements = channel.announcements;

  if (!announcements) {
    return;
  }

  const index = announcements.findIndex((v) => v.id === announcementID);

  if (index < 0) {
    return;
  }

  announcements.splice(index);
  await db
    .update(channelsTable)
    .set({ announcements, updatedAt: nowDate })
    .where(
      and(
        eq(channelsTable.channelID, channelID),
        eq(channelsTable.updatedAt, updatedAtDate),
        sql`EXISTS(SELECT 1 FROM json_each(owners) WHERE value = ${userID})`,
      ),
    );
};
