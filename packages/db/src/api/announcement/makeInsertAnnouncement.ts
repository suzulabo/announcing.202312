import { createHash } from 'crypto';

import { db } from '../../client';
import { base62 } from '../../lib/base62';
import { announcementsTable } from '../../schema';
import { type BlobInsertQuery, makeInsertBlob } from '../blob/makeInsertBlob';

const genID = ({
  headerImage,
  title,
  body,
  images,
  createdAt,
}: {
  headerImage: string | null | undefined;
  title: string | undefined;
  body: string;
  images: string[] | undefined;
  createdAt: number;
}) => {
  const hash = createHash('sha256');

  const createdDate = new Date(createdAt);

  const list = [
    headerImage,
    title,
    body,
    ...(images ?? []),
    new Date(createdDate.getFullYear(), createdDate.getMonth(), createdDate.getDate())
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

  return base62.encode(new Uint8Array(digest.buffer)).substring(0, 6);
};

export const makeInsertAnnouncement = async ({
  userID,
  channelID,
  headerImageFile,
  title,
  body,
  imagesFiles,
  updatedAt,
  createdAt,
}: {
  userID: string;
  channelID: string;
  headerImageFile?: Blob | undefined;
  title?: string | undefined;
  body: string;
  imagesFiles?: Blob[] | undefined;
  updatedAt: number;
  createdAt: number;
}) => {
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

  const announcementID = genID({ headerImage, title, body, images, createdAt });

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
