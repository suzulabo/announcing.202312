import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  userID: text('userID').primaryKey().notNull(),
});

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
    threadID: integer('threadID')
      .notNull()
      .references(() => threads.threadID, { onUpdate: 'cascade', onDelete: 'cascade' }),
    userID: text('userID')
      .notNull()
      .references(() => users.userID, { onUpdate: 'cascade', onDelete: 'cascade' }),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.threadID, table.userID] }),
    };
  },
);
