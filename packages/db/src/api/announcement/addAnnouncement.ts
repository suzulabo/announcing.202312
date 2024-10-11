import { and, eq } from 'drizzle-orm';

import { db } from '../../client';
import { announcementsTable, channelsTable } from '../../schema';
import { makeInsertBlob } from '../blob/makeInsertBlob';
import { getChannel } from '../channel/getChannel';
import { genAnnouncementID } from './genAnnouncementID';

export const addAnnouncement = async ({
  userID,
  channelID,
  headerImageFile,
  title,
  body,
  imagesFiles,
  createdAt,
}: {
  userID: string;
  channelID: string;
  headerImageFile: Blob | undefined;
  title: string | undefined;
  body: string;
  imagesFiles: Blob[] | undefined;
  createdAt: number;
}) => {
  const channel = await getChannel({ userID, channelID });
  if (!channel) {
    return;
  }

  const queries = [];

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

  if (headerImageFile) {
    const [v, q] = await makeInsertBlob(headerImageFile);
    values.headerImage = v;
    queries.push(q);
  }

  if (imagesFiles) {
    const images = [];
    for (const f of imagesFiles) {
      const [v, q] = await makeInsertBlob(f);
      images.push(v);
      queries.push(q);
    }
    values.images = images;
  }

  const announcementID = genAnnouncementID(values);

  queries.push(db.insert(announcementsTable).values({ ...values, announcementID }));

  const announcementIDs = channel.announcementIDs ?? [];
  announcementIDs.push(announcementID);

  const updateChannel = db
    .update(channelsTable)
    .set({
      announcementIDs,
      updatedAt: new Date().getTime(),
    })
    .where(
      and(eq(channelsTable.channelID, channelID), eq(channelsTable.updatedAt, channel.updatedAt)),
    );

  await db.batch([updateChannel, ...queries]);
};
