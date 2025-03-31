import { Buffer } from 'buffer';
import { xxHash32 } from 'js-xxhash';
import { genDatePrefix } from './genDatePrefix';

const toBase64 = (n: number) => {
  const buf = Buffer.alloc(4);
  buf.writeUint32BE(n);
  return buf.toString('base64url');
};

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

  return `${genDatePrefix(createdAt)}${toBase64(xxHash32(data))}`;
};
