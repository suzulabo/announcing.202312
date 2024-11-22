import { assert, beforeEach, describe, expect, test } from 'vitest';

import { openAsBlob } from 'fs';
import {
  addAnnouncement,
  createChannel,
  getAnnouncement,
  getChannel,
  getStorageData,
  removeAnnouncement,
  updateAnnouncement,
} from '../src';
import { setupDB } from './setupDB';

describe('Announcement', () => {
  beforeEach(async () => {
    await setupDB();
  });

  test('add, update and remove', async () => {
    await createChannel({
      userID: 'u1',
      channelID: 'a1',
      name: 'announcement test channel',
      desc: undefined,
      icon: undefined,
    });

    await addAnnouncement({
      userID: 'u1',
      channelID: 'a1',
      headerImage: await openAsBlob('tests/board-361516_1280.jpg', { type: 'image/jpeg' }),
      title: 'test',
      body: 'This is test',
      images: [await openAsBlob('tests/board-361516_1280.jpg', { type: 'image/jpeg' })],
      createdAt: new Date().getTime(),
    });

    {
      const c = await getChannel({ userID: 'u1', channelID: 'a1' });
      assert(c);

      const announcementID = c.announcementIDs?.shift() ?? '';

      const a = await getAnnouncement({
        channelID: 'a1',
        announcementID,
      });
      assert(a);

      expect(a).toMatchObject({
        title: 'test',
        body: 'This is test',
      });

      const b = await getStorageData(a.headerImage ?? '');
      assert(b);

      await updateAnnouncement({
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
      const c = await getChannel({ userID: 'u1', channelID: 'a1' });
      assert(c);

      const announcementID = c.announcementIDs?.shift() ?? '';

      const a = await getAnnouncement({
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

      await removeAnnouncement({
        userID: 'u1',
        channelID: 'a1',
        targetAnnouncementID: announcementID,
        targetUpdatedAt: a.updatedAt,
      });

      expect(
        await getAnnouncement({
          channelID: 'a1',
          announcementID,
        }),
      ).toBeUndefined();
    }
  });
});
