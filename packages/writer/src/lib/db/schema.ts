import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const channelsTable = sqliteTable('channels', {
  channelID: text('channelID').notNull().primaryKey(),
  title: text('title').notNull(),
  desc: text('desc'),
  icon: text('icon'),
  links: text('links', { mode: 'json' }).$type<{ name: string; url: string }[]>(),
  announcements: text('announcements', { mode: 'json' }).$type<
    {
      id: string;
      size: number;
      headerImage?: string;
      title?: string | null;
      body: string;
      images?: string[];
      links?: string[];
      updatedAt: number;
      createdAt: number;
    }[]
  >(),
  owners: text('owners', { mode: 'json' }).$type<string[]>().notNull(),
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
});

type ChannelsTable = typeof channelsTable.$inferInsert;

export type Announcements = Exclude<ChannelsTable['announcements'], null | undefined>;

export type Announcement = Announcements[number];

export const usersTable = sqliteTable('users', {
  userID: text('userID').notNull().primaryKey(),
  channels: text('channels', { mode: 'json' }).$type<string[]>(),
});
