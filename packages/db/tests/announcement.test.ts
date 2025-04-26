import { assert, describe, expect, test } from 'vitest';

import { openAsBlob } from 'fs';
import { createDB } from '../src';
import { createLocalBindings } from '../src/db/localBindings';

describe('Announcement', () => {
  test('add, update and remove', async () => {
    const db = await createDB('', false);
    const bindings = await createLocalBindings(true);

    await db.createChannel(bindings, {
      userID: 'u1',
      channelID: 'a1',
      name: 'announcement test channel',
      desc: undefined,
      icon: undefined,
    });

    await db.addAnnouncement(bindings, {
      userID: 'u1',
      channelID: 'a1',
      headerImage: await openAsBlob('tests/board-361516_1280.jpg', { type: 'image/jpeg' }),
      title: 'test',
      body: 'This is test',
      images: [await openAsBlob('tests/board-361516_1280.jpg', { type: 'image/jpeg' })],
      createdAt: new Date().getTime(),
    });

    {
      const c = await db.getChannel(bindings, { userID: 'u1', channelID: 'a1' });
      assert(c);

      const announcementID = c.announcementIDs?.shift() ?? '';

      const a = await db.getAnnouncement(bindings, {
        channelID: 'a1',
        announcementID,
      });
      assert(a);

      expect(a).toMatchObject({
        title: 'test',
        body: 'This is test',
      });

      const b = await db.getStorage(bindings, a.headerImage ?? '');
      assert(b);

      await db.updateAnnouncement(bindings, {
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
      const c = await db.getChannel(bindings, { userID: 'u1', channelID: 'a1' });
      assert(c);

      const announcementID = c.announcementIDs?.shift() ?? '';

      const a = await db.getAnnouncement(bindings, {
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

      await db.removeAnnouncement(bindings, {
        userID: 'u1',
        channelID: 'a1',
        targetAnnouncementID: announcementID,
        targetUpdatedAt: a.updatedAt,
      });

      expect(
        await db.getAnnouncement(bindings, {
          channelID: 'a1',
          announcementID,
        }),
      ).toBeUndefined();
    }
  });
});
