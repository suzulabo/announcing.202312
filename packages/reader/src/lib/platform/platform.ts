export const isIOS = () => {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
};

export const isStandalone = () => {
  interface NavigatorStandalone extends Navigator {
    standalone?: unknown;
  }

  return !!(window.navigator as NavigatorStandalone).standalone;
};
