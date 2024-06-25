import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';
import * as schema from '../schema';

const sqlite = createClient({ url: ':memory:' });

export const db = drizzle(sqlite, { schema });

await migrate(db, { migrationsFolder: './drizzle' });
