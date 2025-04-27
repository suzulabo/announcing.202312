import { type TokenStore as TokenStoreInternal } from './types';

export type TokenStore = Pick<TokenStoreInternal, 'putToken'>;
