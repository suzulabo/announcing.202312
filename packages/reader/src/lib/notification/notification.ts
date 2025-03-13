import { browser } from '$app/environment'
import { postNotification } from '$lib/fetch/postNotification'
import { getPushToken } from '$lib/firebase/firebase'
import {
  addNotificationChannelsListener,
  getNotificationChannels,
  setNotificationChannels,
} from '$lib/platform/localStorage'
import { notificationState } from './notificationState.svelte'

function loadChannels() {
  notificationState.channels = getNotificationChannels()
}

export async function initNotification() {
  if (!browser) {
    return
  }

  addNotificationChannelsListener(loadChannels)

  loadChannels()

  if ('Notification' in window) {
    notificationState.permission = Notification.permission
  }
  if (localStorage.getItem('ios-token')) {
    notificationState.permission = 'granted'
  }

  if (navigator.permissions) {
    const permissionStatus = await navigator.permissions.query({ name: 'notifications' })
    permissionStatus.addEventListener('change', () => {
      notificationState.permission = Notification.permission
    })
  }
}

export async function requestPermission() {
  notificationState.permission = await Notification.requestPermission()
}

export async function addChannel(channelID: string) {
  const curChannels = [...notificationState.channels]
  const newChannels = [...curChannels]

  if (!newChannels.includes(channelID)) {
    newChannels.push(channelID)
  }

  setNotificationChannels(newChannels)

  const token = await getPushToken()
  if (!token) {
    return
  }

  try {
    await postNotification({ token, tags: newChannels })
    notificationState.channels = newChannels
  }
  catch {
    setNotificationChannels(curChannels)
    // TODO
  }
}

export async function removeChannel(channelID: string) {
  const curChannels = [...notificationState.channels]
  const newChannels = curChannels.filter((v) => {
    return v !== channelID
  })

  setNotificationChannels(newChannels)

  const token = await getPushToken()
  if (!token) {
    return
  }

  try {
    await postNotification({ token, tags: newChannels })
    notificationState.channels = newChannels
  }
  catch {
    setNotificationChannels(curChannels)
    // TODO
  }
}
