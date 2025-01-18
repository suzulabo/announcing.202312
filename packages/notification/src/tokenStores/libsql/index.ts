import { createLibSqlTokenStore as createLibSqlTokenStoreInternal } from './libsqlTokenStore';
import type { Config } from './shared';

export const createLibSqlTokenStore = (config: Config) => {
  const store = createLibSqlTokenStoreInternal(config);

  return {
    putToken: store.putToken,
  };
};
