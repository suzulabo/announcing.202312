import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

const sqlite = createClient({ url: 'file:../db-dev/dev.db' });

export const db = drizzle(sqlite, { logger: true });
