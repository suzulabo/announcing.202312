import { assert, describe, expect, test } from 'vitest';

import { openAsBlob } from 'fs';
import {
  addAnnouncement,
  createChannel,
  getAnnouncement,
  getChannel,
  removeAnnouncement,
  updateAnnouncement,
} from '../src';
import { setupDB } from './setupDB';

describe('Announcement', () => {
  test('add, update and remove', async () => {
    const { db, storage } = await setupDB();

    await createChannel(db, storage, {
      userID: 'u1',
      channelID: 'a1',
      name: 'announcement test channel',
      desc: undefined,
      icon: undefined,
    });

    await addAnnouncement(db, storage, {
      userID: 'u1',
      channelID: 'a1',
      headerImage: await openAsBlob('tests/board-361516_1280.jpg', { type: 'image/jpeg' }),
      title: 'test',
      body: 'This is test',
      images: [await openAsBlob('tests/board-361516_1280.jpg', { type: 'image/jpeg' })],
      createdAt: new Date().getTime(),
    });

    {
      const c = await getChannel(db, { userID: 'u1', channelID: 'a1' });
      assert(c);

      const announcementID = c.announcementIDs?.shift() ?? '';

      const a = await getAnnouncement(db, {
        channelID: 'a1',
        announcementID,
      });
      assert(a);

      expect(a).toMatchObject({
        title: 'test',
        body: 'This is test',
      });

      const b = await storage.get(a.headerImage ?? '');
      assert(b);

      await updateAnnouncement(db, storage, {
        userID: 'u1',
        channelID: 'a1',
        targetAnnouncementID: announcementID,
        targetUpdatedAt: a.updatedAt,
        title: 'updated',
        body: 'This is updated',
        headerImage: undefined,
        images: undefined,
      });
    }

    {
      const c = await getChannel(db, { userID: 'u1', channelID: 'a1' });
      assert(c);

      const announcementID = c.announcementIDs?.shift() ?? '';

      const a = await getAnnouncement(db, {
        channelID: 'a1',
        announcementID,
      });
      assert(a);
      expect(a).toMatchObject({
        title: 'updated',
        body: 'This is updated',
        headerImage: undefined,
        images: undefined,
      });

      await removeAnnouncement(db, {
        userID: 'u1',
        channelID: 'a1',
        targetAnnouncementID: announcementID,
        targetUpdatedAt: a.updatedAt,
      });

      expect(
        await getAnnouncement(db, {
          channelID: 'a1',
          announcementID,
        }),
      ).toBeUndefined();
    }
  });
});
