import type { Handle } from '@sveltejs/kit'
import { env } from '$env/dynamic/private'
import { CF } from '$env/static/private'
import { setStorage } from '@announcing/db'
import { createLibSqlTokenStore } from '@announcing/notification/tokenStores/libsql'
import { createClient } from '@libsql/client'

import { sequence } from '@sveltejs/kit/hooks'

// TODO*
// process.env.DB_URL = env.DB_URL
// process.env.DB_AUTH_TOKEN = env.DB_AUTH_TOKEN

if (!CF) {
  // eslint-disable-next-line antfu/no-top-level-await
  const createLocalStorage = (await import('@announcing/db/LocalStorage')).createLocalStorage
  setStorage(createLocalStorage())
}

const notificationTokenStoreHandle: Handle = ({ resolve, event }) => {
  const client = createClient({
    url: env.NOTIFICATION_DB_URL,
    authToken: env.NOTIFICATION_DB_AUTH_TOKEN,
  })

  const notificationTokenStore = createLibSqlTokenStore({
    client,
  })

  event.locals.tokenStore = notificationTokenStore

  return resolve(event)
}

export const handle = sequence(notificationTokenStoreHandle)
