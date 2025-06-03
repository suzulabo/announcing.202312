const LOCAL_STORAGE_KEY = 'notification-channels';
export type LocalStorageValue = Record<string, { name: string }>;

export const saveNotificationChannels = (v: LocalStorageValue) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(v));
};

export const getNotificationChannels = (): LocalStorageValue => {
  const s = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!s) {
    return {};
  } else {
    try {
      return JSON.parse(s);
    } catch {
      return {};
    }
  }
};
