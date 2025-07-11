const BASE_DATE = Date.UTC(2025, 0, 1, 0, 0, 0, 0);
const CHARACTERS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_';
const CHARACTERS_LENGTH = CHARACTERS.length;

const toID = (n: number) => {
  let s = '';

  while (n > 0) {
    s = `${CHARACTERS[n % CHARACTERS_LENGTH]}${s}`;
    n = Math.trunc(n / CHARACTERS_LENGTH);
  }

  return s;
};

const idSuffix = /^(.+)\/([0-9]+)$/;

export const genAnnouncementID = (createdAt: number, prevID = '') => {
  const id = toID(Math.trunc((createdAt - BASE_DATE) / 1000));
  if (!prevID) {
    return id;
  } else {
    const m = prevID.match(idSuffix);
    if (m) {
      const [, p, s] = m as [string, string, string];
      if (id !== p) {
        throw new Error('invalid prevID');
      }
      const suffix = parseInt(s);
      return `${id}/${suffix + 1}`;
    } else if (id !== prevID) {
      throw new Error('invalid prevID');
    } else {
      return `${id}/1`;
    }
  }
};
