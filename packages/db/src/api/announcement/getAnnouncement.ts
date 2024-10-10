import { and, eq } from 'drizzle-orm';

import { db } from '../../client';
import { getEnv } from '../../lib/env';
import { announcementsTable } from '../../schema';

export const getAnnouncement = async ({
  channelID,
  announcementID,
}: {
  channelID: string;
  announcementID: string;
}) => {
  const { title, body, headerImage, images, updatedAt, createdAt } = announcementsTable;

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

  const { imagePrefix } = getEnv();

  return {
    ...announcement,
    title: announcement.title ?? undefined,
    headerImage: announcement.headerImage ? `${imagePrefix}${announcement.headerImage}` : undefined,
    images: announcement.images
      ? announcement.images.map((v) => {
          return `${imagePrefix}${v}`;
        })
      : undefined,
  };
};
