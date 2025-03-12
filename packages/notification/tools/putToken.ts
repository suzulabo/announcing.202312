import { createClient } from '@libsql/client'
import { configDotenv } from 'dotenv'
import { createLibSqlTokenStore } from '../src/tokenStores/libsql/libsqlTokenStore'

configDotenv({ path: '.env.local' })

async function main() {
  const [token, ...tags] = process.argv.slice(2)

  if (!token || tags.length === 0) {
    console.log('pnpm run putToken {token} {tag1} {tag2}...')
    return
  }

  const client = createClient({
    url: process.env.DB_URL ?? '',
    authToken: process.env.DB_AUTH_TOKEN ?? '',
  })

  const tokenStore = createLibSqlTokenStore({ client })

  await tokenStore.putToken(token, tags)
}

await main()

export {}
