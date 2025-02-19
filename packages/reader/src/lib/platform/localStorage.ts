const KEY_NOTIFICATION_CHANNELS = 'notification-channels';
const KEY_IOS_TOKEN = 'ios-token';
const KEY_IOS_BROWSER_SCHEMA = 'ios-browser-schema';

export const setNotificationChannels = (v: string[]) => {
  localStorage.setItem(KEY_NOTIFICATION_CHANNELS, JSON.stringify(v));
};

export const getNotificationChannels = (): string[] => {
  const s = localStorage.getItem(KEY_NOTIFICATION_CHANNELS);
  if (!s) {
    return [];
  } else {
    try {
      return JSON.parse(s);
    } catch {
      return [];
    }
  }
};

export const addNotificationChannelsListener = (cb: () => void) => {
  window.addEventListener('storage', (event) => {
    if (event.key === KEY_NOTIFICATION_CHANNELS) {
      cb();
    }
  });
};

export const setIOSToken = (v: string) => {
  localStorage.setItem(KEY_IOS_TOKEN, v);
};

export const getIOSToken = () => {
  return localStorage.getItem(KEY_IOS_TOKEN);
};

export const setIOSBrowserSchema = (v: string) => {
  localStorage.setItem(KEY_IOS_BROWSER_SCHEMA, v);
};

export const getIOSBrowserSchema = () => {
  return localStorage.getItem(KEY_IOS_BROWSER_SCHEMA);
};
