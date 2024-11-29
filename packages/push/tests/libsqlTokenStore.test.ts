import { createClient } from '@libsql/client';
import { readFileSync } from 'node:fs';
import { describe, test } from 'vitest';
import { createLibSqlTokenStore } from '../src/tokenStores/libsql/libsqlTokenStore';

const schemas = readFileSync('src/tokenStores/libsql/schema.sql', 'utf8')
  .split(';')
  .filter((v) => {
    return !!v.trim();
  });

const createTestClient = async () => {
  const client = createClient({ url: ':memory:' });

  await client.migrate(schemas);

  return client;
};

describe('libsqlTokenStore', () => {
  test('set, remove', async () => {
    const client = await createTestClient();

    const store = createLibSqlTokenStore(client);

    await store.putToken('token1', ['123', '456']);
    await store.putToken('token1', ['123']);

    {
      const tokens = await client.execute('SELECT * FROM tokens');
      console.log(tokens.rows);
      const tags = await client.execute('SELECT * FROM tags');
      console.log(tags.rows);
    }
  });
});
