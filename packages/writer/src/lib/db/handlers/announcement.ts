import { storeFile } from '$lib/file/storeFile';
import { base62 } from '$lib/utils/base62';
import { createHash } from 'crypto';
import { and, eq, sql } from 'drizzle-orm';
import { db } from '../client';
import { channelsTable, type Announcements } from '../schema';

const getHash = (...args: (string | null | undefined)[]) => {
  const hash = createHash('sha256');

  for (const a of args) {
    if (typeof a === 'string') {
      hash.update(a);
    } else {
      hash.update('\0');
    }
  }

  const digest = hash.digest();

  return base62.encode(digest).substring(0, 8);
};

const removeUndefined = <T extends object>(o: T): T => {
  const n: Partial<T> = {};

  Object.entries(o).forEach(([k, v]) => {
    if (v !== undefined && v !== null) {
      n[k as keyof T] = v;
    }
  });

  return n as T;
};

const writeAnnouncement = async (
  userID: string,
  channelID: string,
  channelUpdatedAt: number,
  headerImageFile: File | undefined | null,
  title: string | undefined | null,
  body: string,
  imagesFiles: File[] | undefined | null,
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

  const headerImage = (headerImageFile && (await storeFile(headerImageFile))) || undefined;

  const images =
    imagesFiles && imagesFiles.length > 0
      ? await Promise.all(imagesFiles.map((v) => storeFile(v)))
      : undefined;

  const nowDate = new Date();

  const now = nowDate.getTime();

  const id = getHash(`${now}`, body, title, headerImage, ...(images ?? []));

  const announcements: Announcements = channel.announcements || [];

  if (!updateAnnouncementId) {
    announcements.push(
      removeUndefined({
        id,
        headerImage,
        title,
        body,
        images,
        updatedAt: now,
        createdAt: now,
      }),
    );
  } else {
    const index = announcements.findIndex((v) => v.id === updateAnnouncementId);

    if (index >= 0) {
      const cur = announcements[index];

      announcements[index] = removeUndefined({
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

export const addAnnouncement = (
  userID: string,
  channelID: string,
  channelUpdatedAt: number,
  headerImageFile: File | undefined | null,
  title: string | undefined | null,
  body: string,
  imagesFiles: File[] | undefined | null,
) => {
  return writeAnnouncement(
    userID,
    channelID,
    channelUpdatedAt,
    headerImageFile,
    title,
    body,
    imagesFiles,
    undefined,
  );
};

export const updateAnnouncement = (
  userID: string,
  channelID: string,
  channelUpdatedAt: number,
  headerImageFile: File | undefined | null,
  title: string | undefined | null,
  body: string,
  imagesFiles: File[] | undefined | null,
  updateAnnouncementId: string,
) => {
  return writeAnnouncement(
    userID,
    channelID,
    channelUpdatedAt,
    headerImageFile,
    title,
    body,
    imagesFiles,
    updateAnnouncementId,
  );
};

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
