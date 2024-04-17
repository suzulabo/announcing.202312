import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const threads = sqliteTable(
  'threads',
  {
    threadID: integer('threadID').notNull(),
    title: text('title').notNull(),
    desc: text('desc'),
    icon: text('icon'),
    links: text('links', { mode: 'json' }).$type<{ name: string; url: string }[]>(),
    updatedAt: integer('updatedAt', { mode: 'timestamp' }).$default(() => {
      return new Date();
    }),
    createdAt: integer('createdAt', { mode: 'timestamp' }).$default(() => {
      return new Date();
    }),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.threadID] }),
    };
  },
);

export const threadOwners = sqliteTable(
  'threadOwners',
  {
    threadID: integer('threadID').notNull(),
    userID: text('userID').notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.threadID, table.userID] }),
    };
  },
);
