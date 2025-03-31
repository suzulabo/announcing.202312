import { imageDimensionsFromData } from 'image-dimensions';
import imageType from 'image-type';
import { encodeBase64Url } from './encodeBase64Url';

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

export const genStorageKey = async (blob: Blob) => {
  const ab = new Uint8Array(await blob.arrayBuffer());

  const digest = await crypto.subtle.digest('SHA-256', ab);
  const hash = encodeBase64Url(new Uint8Array(digest));

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
