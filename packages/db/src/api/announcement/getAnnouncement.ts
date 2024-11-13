import { and, eq } from 'drizzle-orm';

import { getDB } from '../../client';
import { announcementsTable } from '../../schema';

export const getAnnouncement = async ({
  channelID,
  announcementID,
}: {
  channelID: string;
  announcementID: string;
}) => {
  const { title, body, headerImage, images, updatedAt, createdAt } = announcementsTable;

  const db = getDB();

  const announcement = (
    await db
      .select({
        title,
        body,
        headerImage,
        images,
        updatedAt,
        createdAt,
      })
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
