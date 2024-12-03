import { debugClient, type Config } from './shared';

const SELECT_TOKENS = `
SELECT tokens,tail FROM tags WHERE tag = :tag AND sub = :sub
`;

export const getTokensReader = (
  config: Config,
  tag: string,
): (() => Promise<string[] | undefined>) => {
  const client = config.debug ? debugClient(config.client) : config.client;

  let sub = 1;

  const read = async () => {
    if (sub === 0) {
      return;
    }
    const row = (await client.execute({ sql: SELECT_TOKENS, args: { tag, sub } })).rows.shift();
    if (!row) {
      sub = 0;
      return;
    }

    if (row['tail']) {
      sub = 0;
    } else {
      sub++;
    }

    return (row['tokens'] as string)
      .trim()
      .split(' ')
      .filter((v) => !!v.trim());
  };

  return read;
};
