import type { LibSQLDatabase } from 'drizzle-orm/libsql'
import process from 'node:process'
import { drizzle as drizzleLibSql } from 'drizzle-orm/libsql'

function createDB() {
  const { DB_URL, DB_AUTH_TOKEN } = process.env
  if (!DB_URL) {
    throw new Error('DB_URL is not set')
  }

  if (DB_AUTH_TOKEN) {
    return drizzleLibSql({
      connection: {
        url: DB_URL,
        authToken: DB_AUTH_TOKEN,
      },
    })
  }
  else {
    return drizzleLibSql({
      connection: {
        url: DB_URL,
      },
    })
  }
}

let db: LibSQLDatabase | undefined

export function getDB(forceCreate = false): LibSQLDatabase {
  if (!db || forceCreate) {
    db = createDB()
  }
  return db
}
