import { base62 } from '$lib/utils/base62';
import { createHash } from 'crypto';
import { and, eq, inArray } from 'drizzle-orm';
import { db } from '../client';
import { channelOwnersTable, channelsTable, type Announcements } from '../schema';

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

export const addAnnouncement = async (
  userID: string,
  channelID: number,
  updatedAt: number,
  body: string,
  title?: string | null,
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

  const id = getHash(body, title);

  const size = getSize(body, title);

  const now = new Date();

  const announcements: Announcements = channel.announcements || [];

  announcements.push({
    id,
    size,
    title,
    body,
    updatedAt: now.getTime(),
    createdAt: now.getTime(),
  });

  const ownedChannels = db
    .select({ channelID: channelOwnersTable.channelID })
    .from(channelOwnersTable)
    .where(eq(channelOwnersTable.userID, userID));

  await db
    .update(channelsTable)
    .set({ announcements, updatedAt: now })
    .where(
      and(
        eq(channelsTable.channelID, channelID),
        eq(channelsTable.updatedAt, new Date(updatedAt)),
        inArray(channelsTable.channelID, ownedChannels),
      ),
    );
};
