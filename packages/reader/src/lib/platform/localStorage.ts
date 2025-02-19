const KEY_IOS_TOKEN = 'ios-token';
const KEY_IOS_BROWSER_SCHEMA = 'ios-browser-schema';

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
