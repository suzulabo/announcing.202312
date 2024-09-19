import { createHash } from 'crypto';

import { db } from '../../client';
import { base62 } from '../../lib/base62';
import { announcementsTable } from '../../schema';
import { type BlobInsertQuery, makeInsertBlob } from '../blob/makeInsertBlob';

const genID = (
  headerImage: string | null | undefined,
  title: string | undefined,
  body: string,
  imagesFiles: string[] | undefined,
  createdAt: Date,
) => {
  const hash = createHash('sha256');

  const list = [
    headerImage,
    title,
    body,
    ...(imagesFiles ?? []),
    new Date(createdAt.getFullYear(), createdAt.getMonth(), createdAt.getDate())
      .getTime()
      .toString(),
  ];

  for (const s of list) {
    if (typeof s === 'string') {
      hash.update(s);
    } else {
      hash.update('\0');
    }
  }

  const digest = hash.digest();

  return base62.encode(digest).substring(0, 6);
};

export const makeInsertAnnouncement = async (
  userID: string,
  channelID: string,
  headerImageFile: Blob | undefined,
  title: string | undefined,
  body: string,
  imagesFiles: Blob[] | undefined,
  updatedAt: Date,
  createdAt: Date,
) => {
  const [headerImage, headerImageInsert] = headerImageFile
    ? await makeInsertBlob(headerImageFile)
    : [null, undefined];

  const [images, imagesInserts] = (
    await Promise.all(
      (imagesFiles ?? []).map((v) => {
        return makeInsertBlob(v);
      }),
    )
  ).reduce<[string[], BlobInsertQuery[]]>(
    ([ids, queries], [id, query]) => {
      ids.push(id);
      queries.push(query);
      return [ids, queries];
    },
    [[], []],
  );

  const announcementID = genID(headerImage, title, body, images, createdAt);

  return {
    announcementID,
    announcementQueries: [
      db.insert(announcementsTable).values({
        channelID,
        userID,
        announcementID,
        headerImage,
        title: title ?? null,
        body,
        images,
        updatedAt,
        createdAt,
      }),
      ...(headerImageInsert ? [headerImageInsert] : []),
      ...imagesInserts,
    ] as const,
  };
};
