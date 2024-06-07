import { index, integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const channelsTable = sqliteTable(
  'channels',
  {
    channelID: integer('channelID').notNull(),
    title: text('title').notNull(),
    desc: text('desc'),
    icon: text('icon'),
    links: text('links', { mode: 'json' }).$type<{ name: string; url: string }[]>(),
    announcements: text('announcements', { mode: 'json' }).$type<{
      [id: string]: {
        size: number;
        title?: string | null;
        body: string;
        mainImage?: string;
        images?: string[];
        links?: string[];
        updatedAt: number;
        createdAt: number;
      };
    }>(),
    updatedAt: integer('updatedAt', { mode: 'timestamp' })
      .$default(() => {
        return new Date();
      })
      .notNull(),
    createdAt: integer('createdAt', { mode: 'timestamp' })
      .$default(() => {
        return new Date();
      })
      .notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.channelID] }),
    };
  },
);

type ChannelsTable = typeof channelsTable.$inferInsert;

export type Announcements = Exclude<ChannelsTable['announcements'], null | undefined>;

export type Announcement = Announcements[string];

export const channelOwnersTable = sqliteTable(
  'channelOwners',
  {
    channelID: integer('channelID').notNull(),
    userID: text('userID').notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.channelID, table.userID] }),
      userID: index('userID').on(table.userID),
    };
  },
);
