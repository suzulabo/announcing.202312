interface NotificationState {
  channels: string[]
  permission: NotificationPermission | 'not-supported'
}

export const notificationState = $state<NotificationState>({
  channels: [],
  permission: 'not-supported',
})
