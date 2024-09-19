import { and, eq } from 'drizzle-orm';

import { db } from '../../client';
import { announcementsTable } from '../../schema';

export const getAnnouncement = async (channelID: string, announcementID: string) => {
  const announcement = (
    await db
      .select()
      .from(announcementsTable)
      .where(
        and(
          eq(announcementsTable.channelID, channelID),
          eq(announcementsTable.announcementID, announcementID),
        ),
      )
  ).shift();

  if (!announcement) return;

  return {
    ...announcement,
    title: announcement.title ?? undefined,
    headerImage: announcement.headerImage ?? undefined,
    images: announcement.images ?? undefined,
  };
};
