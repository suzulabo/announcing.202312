import { browser } from '$app/environment';

export const isIOS = () => {
  return browser && /iphone|ipad|ipod/i.test(navigator.userAgent);
};

export const isStandalone = () => {
  interface NavigatorStandalone extends Navigator {
    standalone?: unknown;
  }

  return browser && !!(window.navigator as NavigatorStandalone).standalone;
};

export const getIOSPwaUUID = () => {
  const v = localStorage.getItem('ios-pwa-uuid');
  if (v) {
    return v;
  }

  const uuid = crypto.randomUUID();
  localStorage.setItem('ios-pwa-uuid', uuid);
  return uuid;
};
