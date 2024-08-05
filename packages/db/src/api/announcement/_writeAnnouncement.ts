import { and, eq, sql } from 'drizzle-orm';

import { db } from '../../client';
import { genHash } from '../../lib/genHash';
import { storeFile } from '../../lib/storeFile';
import { stripNullish } from '../../lib/stripNullish';
import { type Announcement, type Announcements, channelsTable } from '../../schema';

export const _writeAnnouncement = async (
  userID: string,
  channelID: string,
  channelUpdatedAt: number,
  headerImageFile: Blob | undefined | null,
  title: string | undefined | null,
  body: string,
  imagesFiles: Blob[] | undefined | null,
  updateAnnouncementId: string | undefined,
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

  const headerImage = (headerImageFile && (await storeFile(headerImageFile))) ?? undefined;

  const images =
    imagesFiles && imagesFiles.length > 0
      ? await Promise.all(imagesFiles.map((v) => storeFile(v)))
      : undefined;

  const nowDate = new Date();

  const now = nowDate.getTime();

  const id = genHash([now.toString(), body, title, headerImage, ...(images ?? [])]);

  const announcements: Announcements = channel.announcements ?? [];

  if (!updateAnnouncementId) {
    const v = stripNullish<Announcement>({
      id,
      headerImage,
      title,
      body,
      images,
      updatedAt: now,
      createdAt: now,
    });

    announcements.push(v);
  } else {
    const index = announcements.findIndex((v) => v.id === updateAnnouncementId);

    const cur = announcements[index];

    if (cur) {
      announcements[index] = stripNullish<Announcement>({
        id,
        headerImage,
        title,
        body,
        images,
        updatedAt: now,
        createdAt: cur.createdAt,
      });
    }
  }

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
