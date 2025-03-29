import { xxHash32 } from 'js-xxhash';
import { encodeBase62FromNumber } from '../../lib/base62';
import { genDatePrefix } from '../../lib/genDatePrefix';

export const genAnnouncementID = ({
  headerImage,
  title,
  body,
  images,
  createdAt,
}: {
  headerImage?: string | null | undefined;
  title?: string | null | undefined;
  body: string;
  images?: string[] | null | undefined;
  createdAt: number;
}) => {
  const list = [headerImage, title, body, ...(images ?? [])];
  const data = list.map((s) => (typeof s === 'string' ? s : '\0')).join('');

  return `${genDatePrefix(createdAt)}${encodeBase62FromNumber(xxHash32(data))}`;
};
