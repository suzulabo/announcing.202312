const BASE_DATE = Date.UTC(2025, 0, 1, 0, 0, 0, 0);
const DATE_MSEC = 24 * 60 * 60 * 1000;
const CHARACTERS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

const toBase62 = (num: number) => {
  let result = '';

  while (num > 0) {
    result = CHARACTERS[num % 62] + result;
    num = Math.floor(num / 62);
  }

  return result;
};

export const genDatePrefix = (v: number) => {
  const d = Math.trunc((v - BASE_DATE) / DATE_MSEC);
  return toBase62(d).padStart(3, '0');
};
