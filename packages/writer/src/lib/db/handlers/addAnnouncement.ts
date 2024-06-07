import base62 from '$lib/utils/base62';
import { createHash } from 'crypto';
import { and, eq } from 'drizzle-orm';
import { db } from '../client';
import { channelsTable, type Announcements } from '../schema';

const getHash = (...args: (string | null | undefined)[]) => {
  const hash = createHash('sha256');

  for (const a in args) {
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

export const addAnnouncement = async (
  userID: string,
  channelID: number,
  updatedAt: number,
  body: string,
  title?: string | null,
) => {
  console.log({ channelID, updatedAt });

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

  const key = getHash(body, title);

  const size = getSize(body, title);

  const now = new Date();

  const announcements: Announcements = {
    ...channel.announcements,
    [key]: {
      size,
      title,
      body,
      updatedAt: now.getTime(),
      createdAt: now.getTime(),
    },
  };

  await db
    .update(channelsTable)
    .set({ announcements, updatedAt: now })
    .where(
      and(eq(channelsTable.channelID, channelID), eq(channelsTable.updatedAt, new Date(updatedAt))),
    );
};
