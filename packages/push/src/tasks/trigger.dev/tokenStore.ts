import { createClient } from '@libsql/client';
import process from 'node:process';
import { createLibSqlTokenStore } from '../../tokenStores/libsql/libsqlTokenStore';

const client = createClient({
  url: process.env['DB_URL'] ?? '',
  authToken: process.env['DB_AUTH_TOKEN'] ?? '',
});

export const tokenStore = createLibSqlTokenStore({ client });
