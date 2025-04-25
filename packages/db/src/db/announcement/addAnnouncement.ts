import { and, eq } from 'drizzle-orm';
import type { LibSQLDatabase } from 'drizzle-orm/libsql';
import { type Storage } from '../../storage/storage';
import { genAnnouncementID } from '../../utils/genAnnouncementID';
import { getChannel } from '../channel/getChannel';
import { announcementsTable, channelsTable } from '../schema';

type Params = {
  userID: string;
  channelID: string;
  headerImage?: Blob | undefined;
  title?: string | undefined;
  body: string;
  images?: Blob[] | undefined;
  createdAt: number;
};

export const addAnnouncement = async (db: LibSQLDatabase, storage: Storage, params: Params) => {
  const { userID, channelID, headerImage, title, body, images, createdAt } = params;

  const channel = await getChannel(db, { userID, channelID });
  if (!channel) {
    return;
  }

  const values: Omit<typeof announcementsTable.$inferInsert, 'announcementID'> = {
    userID,
    channelID,
    body,
    updatedAt: createdAt,
    createdAt,
  };

  if (title) {
    values.title = title;
  }

  const storagePuts = [];

  if (headerImage) {
    storagePuts.push(
      storage.put(headerImage).then((v) => {
        values.headerImage = v;
      }),
    );
  }

  if (images) {
    const a: string[] = [];
    values.images = a;
    images.forEach((image, i) => {
      storagePuts.push(
        storage.put(image).then((v) => {
          a[i] = v;
        }),
      );
    });
  }

  await Promise.all(storagePuts);

  const announcementID = genAnnouncementID(values);

  const announcementIDs = [announcementID, ...(channel.announcementIDs ?? [])];

  const updateChannel = db
    .update(channelsTable)
    .set({
      announcementIDs,
      updatedAt: new Date().getTime(),
    })
    .where(
      and(eq(channelsTable.channelID, channelID), eq(channelsTable.updatedAt, channel.updatedAt)),
    );

  const announcementValues = { announcementID, ...values };

  await db.batch([updateChannel, db.insert(announcementsTable).values(announcementValues)]);

  return announcementValues;
};
