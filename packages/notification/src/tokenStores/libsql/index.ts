import type { Config } from './shared'
import { createLibSqlTokenStore as createLibSqlTokenStoreInternal } from './libsqlTokenStore'

export function createLibSqlTokenStore(config: Config) {
  const store = createLibSqlTokenStoreInternal(config)

  return {
    putToken: store.putToken,
  }
}
