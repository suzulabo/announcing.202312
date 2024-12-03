import type { InStatement } from '@libsql/client';
import { debugClient, parseTagSub, type Config } from './shared';

const TOKEN_CHUNK_SIZE = 10;

const BATCH_LIMIT = 50;

const SELECT_TOKENS_BASE = 'SELECT token, tags FROM tokens WHERE token IN ';

const REMOVE_TOKEN_FROM_TAG = `
UPDATE tags SET
tokens = REPLACE(tokens, :token || ' ', ''), count = count - 1
WHERE tag = :tag AND sub = :sub AND INSTR(tokens, :token) >= 0
`;

const DELETE_TOKEN = `
DELETE FROM tokens WHERE token = :token
`;

export const removeTokens = async (config: Config, tokens: string[]) => {
  const client = config.debug ? debugClient(config.client) : config.client;

  let statements: InStatement[] = [];

  while (tokens.length > 0) {
    const chunk = tokens.splice(0, TOKEN_CHUNK_SIZE);

    const sql = SELECT_TOKENS_BASE + `(${chunk.map(() => '?').join(',')})`;

    const records = (await client.execute({ sql, args: chunk })).rows;
    for (const record of records) {
      const token = record['token'] as string;
      const tags = record['tags'] as string;

      const tagSubs = tags.split(' ').map((s) => parseTagSub(s));

      // If the number of statements exceeds the limit, batch is executed.
      if (statements.length + tagSubs.length > BATCH_LIMIT) {
        await client.batch(statements);
        statements = [];
      }

      for (const tagSub of tagSubs) {
        statements.push({
          sql: REMOVE_TOKEN_FROM_TAG,
          args: { token, ...tagSub },
        });
      }

      statements.push({
        sql: DELETE_TOKEN,
        args: { token },
      });
    }
  }

  if (statements.length > 0) {
    await client.batch(statements);
  }
};
