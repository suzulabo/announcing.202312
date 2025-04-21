import { xxHash32 } from 'js-xxhash';
import { encodeBase64Url } from './encodeBase64Url';
import { genDatePrefix } from './genDatePrefix';

const toBase64 = (n: number) => {
  const a = new Uint8Array(4);
  const view = new DataView(a.buffer);
  view.setUint32(0, n, false);
  return encodeBase64Url(a);
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
