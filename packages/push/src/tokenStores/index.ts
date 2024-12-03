export type PushTokenStore = {
  putToken: (token: string, tags: string[]) => Promise<void>;
  getTokensReader: (tag: string) => () => Promise<string[] | undefined>;
  deleteTokens: (tokens: string[]) => Promise<void>;
};
