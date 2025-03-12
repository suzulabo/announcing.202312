import process from 'node:process'
import { createClient } from '@libsql/client'
import { createLibSqlTokenStore } from '../../tokenStores/libsql/libsqlTokenStore'

const client = createClient({
  url: process.env.NOTIFICATION_DB_URL ?? '',
  authToken: process.env.NOTIFICATION_DB_AUTH_TOKEN ?? '',
})

export const tokenStore = createLibSqlTokenStore({ client })
