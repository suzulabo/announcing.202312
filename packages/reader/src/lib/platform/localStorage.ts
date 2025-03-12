const KEY_NOTIFICATION_CHANNELS = 'notification-channels'
const KEY_IOS_TOKEN = 'ios-token'
const KEY_IOS_BROWSER_SCHEMA = 'ios-browser-schema'

export function setNotificationChannels(v: string[]) {
  localStorage.setItem(KEY_NOTIFICATION_CHANNELS, JSON.stringify(v))
}

export function getNotificationChannels(): string[] {
  const s = localStorage.getItem(KEY_NOTIFICATION_CHANNELS)
  if (!s) {
    return []
  }
  else {
    try {
      return JSON.parse(s)
    }
    catch {
      return []
    }
  }
}

export function addNotificationChannelsListener(cb: () => void) {
  window.addEventListener('storage', (event) => {
    if (event.key === KEY_NOTIFICATION_CHANNELS) {
      cb()
    }
  })
}

export function setIOSToken(v: string) {
  localStorage.setItem(KEY_IOS_TOKEN, v)
}

export function getIOSToken() {
  return localStorage.getItem(KEY_IOS_TOKEN)
}

export function setIOSBrowserSchema(v: string) {
  localStorage.setItem(KEY_IOS_BROWSER_SCHEMA, v)
}

export function getIOSBrowserSchema() {
  return localStorage.getItem(KEY_IOS_BROWSER_SCHEMA)
}
