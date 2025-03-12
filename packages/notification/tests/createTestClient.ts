import { readFileSync } from 'node:fs'
import { createClient } from '@libsql/client'

const schemas = readFileSync('src/tokenStores/libsql/schema.sql', 'utf8')
  .split(';')
  .filter((v) => {
    return !!v.trim()
  })

export async function createTestClient() {
  const client = createClient({ url: ':memory:' })

  await client.migrate(schemas)

  return client
}
