import { assert, describe, expect, test } from 'vitest';

import { openAsBlob } from 'fs';
import { createLocalDB } from '../src/db/localDB';

describe('Announcement', () => {
  test('add, update and remove', async () => {
    const db = await createLocalDB(true);

    await db.createChannel(
      {
        userID: 'u1',
        channelID: 'a1',
        name: 'announcement test channel',
        desc: undefined,
        icon: undefined,
      },
      undefined,
    );

    await db.addAnnouncement(
      {
        userID: 'u1',
        channelID: 'a1',
        headerImage: await openAsBlob('tests/board-361516_1280.jpg', { type: 'image/jpeg' }),
        title: 'test',
        body: 'This is test',
        images: [await openAsBlob('tests/board-361516_1280.jpg', { type: 'image/jpeg' })],
        createdAt: new Date().getTime(),
      },
      undefined,
    );

    {
      const c = await db.getChannel({ userID: 'u1', channelID: 'a1' }, undefined);
      assert(c);

      const announcementID = c.announcementIDs?.shift() ?? '';

      const a = await db.getAnnouncement(
        {
          channelID: 'a1',
          announcementID,
        },
        undefined,
      );
      assert(a);

      expect(a).toMatchObject({
        title: 'test',
        body: 'This is test',
      });

      const b = await db.getStorage(a.headerImage ?? '', undefined);
      assert(b);

      await db.updateAnnouncement(
        {
          userID: 'u1',
          channelID: 'a1',
          targetAnnouncementID: announcementID,
          targetUpdatedAt: a.updatedAt,
          title: 'updated',
          body: 'This is updated',
          headerImage: undefined,
          images: undefined,
        },
        undefined,
      );
    }

    {
      const c = await db.getChannel({ userID: 'u1', channelID: 'a1' }, undefined);
      assert(c);

      const announcementID = c.announcementIDs?.shift() ?? '';

      const a = await db.getAnnouncement(
        {
          channelID: 'a1',
          announcementID,
        },
        undefined,
      );
      assert(a);
      expect(a).toMatchObject({
        title: 'updated',
        body: 'This is updated',
        headerImage: undefined,
        images: undefined,
      });

      await db.removeAnnouncement(
        {
          userID: 'u1',
          channelID: 'a1',
          targetAnnouncementID: announcementID,
          targetUpdatedAt: a.updatedAt,
        },
        undefined,
      );

      expect(
        await db.getAnnouncement(
          {
            channelID: 'a1',
            announcementID,
          },
          undefined,
        ),
      ).toBeUndefined();
    }
  });
});
