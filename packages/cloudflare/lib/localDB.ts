import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { D1Database, D1DatabaseAPI } from '@miniflare/d1'
import { createSQLiteDB } from '@miniflare/shared'

const sqliteFilename = (() => {
  const dir = '../cloudflare/.wrangler/state/v3/d1/miniflare-D1DatabaseObject'
  const entries = readdirSync(dir, {
    withFileTypes: true,
  })
  const sqliteFiles = entries
    .filter(entry => entry.isFile() && entry.name.endsWith('.sqlite'))
    .map(entry => join(dir, entry.name))

  const result = sqliteFiles.shift()
  if (!result) {
    throw new Error('sqlite file is not found')
  }
  return result
})()

export async function createLocalDB() {
  const sqliteDb = await createSQLiteDB(sqliteFilename)

  const d1 = new D1Database(new D1DatabaseAPI(sqliteDb))

  return d1
}
