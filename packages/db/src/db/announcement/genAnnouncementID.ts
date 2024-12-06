import { createHash } from 'crypto';

import { base62 } from '../../lib/base62';
import { ANNOUNCEMENT_ID_SIZE } from '../../lib/constants';

export const genAnnouncementID = ({
  headerImage,
  title,
  body,
  images,
  createdAt,
}: {
  headerImage?: string | null;
  title?: string | null;
  body: string;
  images?: string[] | null;
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

  return base62.encode(new Uint8Array(digest.buffer)).substring(0, ANNOUNCEMENT_ID_SIZE);
};
