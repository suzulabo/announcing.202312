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

const getSize = (...args: (string | null | undefined)[]) => {
  return args.reduce((p, v) => {
    if (v) {
      return p + v.length;
    }

    return p;
  }, 0);
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
  updatedAt: number,
  headerImage: File | undefined | null,
  title: string | undefined | null,
  body: string,
  images: File[] | undefined | null,
) => {
  const updatedAtDate = new Date(updatedAt);

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

  const headerImageHash = (headerImage && (await storeFile(headerImage))) || undefined;

  const imagesHashList = images ? await Promise.all(images.map((v) => storeFile(v))) : undefined;

  const id = getHash(body, title, headerImageHash, ...(imagesHashList ?? []));

  const size = getSize(body, title);

  const now = new Date();

  const announcements: Announcements = channel.announcements || [];

  announcements.push(
    removeUndefined({
      id,
      size,
      headerImage: headerImageHash,
      title,
      body,
      images: imagesHashList,
      updatedAt: now.getTime(),
      createdAt: now.getTime(),
    }),
  );

  await db
    .update(channelsTable)
    .set({ announcements, updatedAt: now })
    .where(
      and(
        eq(channelsTable.channelID, channelID),
        eq(channelsTable.updatedAt, new Date(updatedAt)),
        sql`EXISTS(SELECT 1 FROM json_each(owners) WHERE value = ${userID})`,
      ),
    );
};
