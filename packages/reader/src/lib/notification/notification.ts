import { browser } from '$app/environment';
import { getPushToken, isNotificationSupported } from '$lib/firebase/firebase';
import { notificationState } from './notificationState.svelte';

const CHANNELS_KEY = 'notification-channels';

const loadChannels = () => {
  const s = localStorage.getItem(CHANNELS_KEY);
  if (!s) {
    if (notificationState.channels.length > 0) {
      notificationState.channels = [];
    }
  } else {
    notificationState.channels = JSON.parse(s);
  }
};

export const initNotification = async () => {
  if (!browser) {
    return;
  }

  window.addEventListener('storage', (event) => {
    if (event.key === CHANNELS_KEY) {
      loadChannels();
    }
  });

  loadChannels();

  if (isNotificationSupported()) {
    notificationState.permission = Notification.permission;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (navigator.permissions) {
      const permissionStatus = await navigator.permissions.query({ name: 'notifications' });
      permissionStatus.addEventListener('change', () => {
        notificationState.permission = Notification.permission;
      });
    }
  }
};

export const requestPermission = async () => {
  notificationState.permission = await Notification.requestPermission();
};

export const addChannel = async (channelID: string) => {
  const channels = [...notificationState.channels];

  if (!channels.includes(channelID)) {
    channels.push(channelID);
    localStorage.setItem(CHANNELS_KEY, JSON.stringify(channels));
  }

  const token = await getPushToken();

  console.log({ token });

  notificationState.channels = channels;
};

export const removeChannel = async (channelID: string) => {
  let channels = [...notificationState.channels];

  if (channels.includes(channelID)) {
    channels = channels.filter((v) => {
      return v !== channelID;
    });
    localStorage.setItem(CHANNELS_KEY, JSON.stringify(channels));
  }

  const token = await getPushToken();

  console.log({ token });

  notificationState.channels = channels;
};
