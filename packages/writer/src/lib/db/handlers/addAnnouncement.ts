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

export const addAnnouncement = async (
  userID: string,
  channelID: string,
  channelUpdatedAt: number,
  headerImageFile: File | undefined | null,
  title: string | undefined | null,
  body: string,
  imagesFiles: File[] | undefined | null,
) => {
  const updatedAtDate = new Date(channelUpdatedAt);

  const channel = (
    await db
      .select({ announcements: channelsTable.announcements })
      .from(channelsTable)
      .where(
        and(eq(channelsTable.channelID, channelID), eq(channelsTable.updatedAt, updatedAtDate)),
      )
  ).shift();

  if (!channel) {
    return;
  }

  const headerImage = (headerImageFile && (await storeFile(headerImageFile))) || undefined;

  console.log({ imagesFiles });

  const images =
    imagesFiles && imagesFiles.length > 0
      ? await Promise.all(imagesFiles.map((v) => storeFile(v)))
      : undefined;

  const nowDate = new Date();

  const now = nowDate.getTime();

  const id = getHash(`${now}`, body, title, headerImage, ...(images ?? []));

  const announcements: Announcements = channel.announcements || [];

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
