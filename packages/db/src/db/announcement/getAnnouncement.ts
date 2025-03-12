import { and, eq } from 'drizzle-orm'

import { getDB } from '../db'
import { announcementsTable } from '../schema'

export async function getAnnouncement({
  channelID,
  announcementID,
}: {
  channelID: string
  announcementID: string
}) {
  const { title, body, headerImage, images, updatedAt, createdAt } = announcementsTable

  const db = getDB()

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
  ).shift()

  if (!announcement)
    return

  return {
    ...announcement,
    title: announcement.title ?? undefined,
    headerImage: announcement.headerImage ?? undefined,
    images: announcement.images ?? undefined,
  }
}
