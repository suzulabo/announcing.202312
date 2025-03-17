import { base62 } from '@announcing/db/utils';

export const getBlobHash = async (blob: Blob) => {
  const arrayBuffer = await blob.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  return base62.encode(new Uint8Array(hashBuffer));
};
