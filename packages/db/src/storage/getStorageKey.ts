import { createHash } from 'crypto';
import { imageDimensionsFromData } from 'image-dimensions';
import imageType from 'image-type';
import { base62 } from '../lib/base62';

const imageSize = async (ab: Uint8Array) => {
  const d = imageDimensionsFromData(ab);
  if (!d) {
    return;
  }

  const t = await imageType(ab);

  return {
    width: d.width,
    height: d.height,
    ext: t?.ext,
    mime: t?.mime,
  };
};

export const getStorageKey = async (blob: Blob) => {
  const ab = new Uint8Array(await blob.arrayBuffer());

  const digest = createHash('sha256').update(ab).digest();

  const hash = base62.encode(new Uint8Array(digest));

  const size = await imageSize(ab);

  const mimeType = size?.mime ?? blob.type;

  if (!size) {
    return [hash, ab, mimeType] as const;
  }

  if (size.ext) {
    return [`${hash}_${size.width}x${size.height}.${size.ext}`, ab, mimeType] as const;
  } else {
    return [`${hash}_${size.width}x${size.height}`, ab, mimeType] as const;
  }
};
