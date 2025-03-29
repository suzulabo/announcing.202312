import bsx from 'base-x';

export const base62 = bsx('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz');

const CHARACTERS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

export const encodeBase62FromNumber = (num: number) => {
  let result = '';

  while (num > 0) {
    result = CHARACTERS[num % 62] + result;
    num = Math.floor(num / 62);
  }

  return result || '0';
};

export const encodeBase62FromArray = (a: Uint8Array) => {
  let num = a.reduce((acc, byte) => (acc << BigInt(8)) | BigInt(byte), BigInt(0));
  let result = '';

  while (num > 0) {
    result = CHARACTERS[Number(num % BigInt(62))] + result;
    num = num / BigInt(62);
  }

  return result || '0';
};
