import { browser } from '$app/environment';

export const isIOS = () => {
  return browser && /iphone|ipad|ipod/i.test(navigator.userAgent);
};
