import { createClient } from '@libsql/client';
import { readFileSync } from 'node:fs';

const schemas = readFileSync('src/tokenStores/libsql/schema.sql', 'utf8')
  .split(';')
  .filter((v) => {
    return !!v.trim();
  });

export const createTestClient = async () => {
  const client = createClient({ url: ':memory:' });

  await client.migrate(schemas);

  return client;
};
