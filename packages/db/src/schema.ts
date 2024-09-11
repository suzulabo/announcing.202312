import { blob, integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const channelsTable = sqliteTable('channels', {
  channelID: text('channelID').notNull().primaryKey(),
  title: text('title').notNull(),
  desc: text('desc'),
  icon: text('icon'),
  announcementIDs: text('announcementIDs', { mode: 'json' }).$type<string[]>(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' })
    .notNull()
    .$default(() => new Date()),
  createdAt: integer('createdAt', { mode: 'timestamp' })
    .notNull()
    .$default(() => new Date()),
});

export const ownersTable = sqliteTable(
  'owners',
  {
    channelID: text('channelID')
      .notNull()
      .references(() => channelsTable.channelID, { onDelete: 'cascade' }),
    userID: text('userID').notNull(),
    createdAt: integer('createdAt', { mode: 'timestamp' })
      .notNull()
      .$default(() => new Date()),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.channelID, table.userID] }),
    };
  },
);

export const announcementsTable = sqliteTable(
  'announcements',
  {
    channelID: text('channelID')
      .notNull()
      .references(() => channelsTable.channelID, { onDelete: 'cascade' }),
    userID: text('userID').notNull(),
    announcementID: text('announcementID').notNull(),
    headerImage: text('headerImage'),
    title: text('title'),
    body: text('body').notNull(),
    images: text('images', { mode: 'json' }).$type<string[]>(),
    updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
    createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.channelID, table.announcementID] }),
    };
  },
);

export const blobsTable = sqliteTable('blobs', {
  blobID: text('blobID').notNull().primaryKey(),
  contentType: text('contentType').notNull(),
  data: blob('blob', { mode: 'buffer' }),
  createdAt: integer('createdAt', { mode: 'timestamp' })
    .notNull()
    .$default(() => new Date()),
});
