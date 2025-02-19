import { browser } from '$app/environment';
import { postNotification } from '$lib/fetch/postNotification';
import { getPushToken } from '$lib/firebase/firebase';
import {
  addNotificationChannelsListener,
  getNotificationChannels,
  setNotificationChannels,
} from '$lib/platform/localStorage';
import { notificationState } from './notificationState.svelte';

const loadChannels = () => {
  notificationState.channels = getNotificationChannels();
};

export const initNotification = async () => {
  if (!browser) {
    return;
  }

  addNotificationChannelsListener(loadChannels);

  loadChannels();

  if ('Notification' in window) {
    notificationState.permission = Notification.permission;
  }
  if (localStorage.getItem('ios-token')) {
    notificationState.permission = 'granted';
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (navigator.permissions) {
    const permissionStatus = await navigator.permissions.query({ name: 'notifications' });
    permissionStatus.addEventListener('change', () => {
      notificationState.permission = Notification.permission;
    });
  }
};

export const requestPermission = async () => {
  notificationState.permission = await Notification.requestPermission();
};

export const addChannel = async (channelID: string) => {
  const curChannels = [...notificationState.channels];
  const newChannels = [...curChannels];

  if (!newChannels.includes(channelID)) {
    newChannels.push(channelID);
  }

  setNotificationChannels(newChannels);

  const token = await getPushToken();
  if (!token) {
    return;
  }

  try {
    await postNotification({ token, tags: newChannels });
    notificationState.channels = newChannels;
  } catch {
    setNotificationChannels(curChannels);
    // TODO
  }
};

export const removeChannel = async (channelID: string) => {
  const curChannels = [...notificationState.channels];
  const newChannels = curChannels.filter((v) => {
    return v !== channelID;
  });

  setNotificationChannels(newChannels);

  const token = await getPushToken();
  if (!token) {
    return;
  }

  try {
    await postNotification({ token, tags: newChannels });
    notificationState.channels = newChannels;
  } catch {
    setNotificationChannels(curChannels);
    // TODO
  }
};
