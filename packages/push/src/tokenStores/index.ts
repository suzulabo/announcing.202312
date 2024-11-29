export type PushTokenStore = {
  putToken: (token: string, tags: string[]) => Promise<void>;
  getTokens: (tag: string) => Iterable<Promise<string[]>>;
};
