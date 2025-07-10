import { browser } from '$app/environment';

export const isIOS = () => {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
};

export const isPWA = () => {
  if (!browser) {
    return false;
  }

  interface NavigatorStandalone extends Navigator {
    standalone?: unknown;
  }

  return !!(window.navigator as NavigatorStandalone).standalone;
};
