import type { TokenStore } from '../../core/types';
import { removeTokens } from './deleteTokens';
import { getTokensReader } from './getTokensReader';
import { putToken } from './putToken';
import type { Config } from './shared';

export const createLibSqlTokenStore = (config: Config): TokenStore & { config: Config } => {
  return {
    putToken: (token: string, tags: string[]) => {
      return putToken(config, token, tags);
    },
    getTokensReader: (tag: string) => {
      return getTokensReader(config, tag);
    },
    deleteTokens: (tokens: string[]) => {
      return removeTokens(config, tokens);
    },
    config,
  };
};
