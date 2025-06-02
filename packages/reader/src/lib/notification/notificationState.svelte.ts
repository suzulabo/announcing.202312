import type { NotificationChannelsValue } from '$lib/platform/localStorage';

type NotificationState = {
  channels: NotificationChannelsValue;
  permission: NotificationPermission | 'not-supported';
};

export const notificationState = $state<NotificationState>({
  channels: {},
  permission: 'not-supported',
});
