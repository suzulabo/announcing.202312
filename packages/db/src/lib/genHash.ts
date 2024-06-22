import { createHash } from 'crypto';
import { base62 } from '../lib/base62';

export const genHash = (args: (string | null | undefined)[], digits = 8) => {
  const hash = createHash('sha256');

  for (const a of args) {
    if (typeof a === 'string') {
      hash.update(a);
    } else {
      hash.update('\0');
    }
  }

  const digest = hash.digest();

  return base62.encode(digest).substring(0, digits);
};
