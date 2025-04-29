import { assert, describe, expect, test } from 'vitest';

import { openAsBlob } from 'fs';
import { createDB } from '../src';
import { createLocalBindings } from '../src/local/localBindings';

describe('Announcement', () => {
  test('add, update and remove', async () => {
    const db = createDB('');
    const bindings = await createLocalBindings(true);

    await db.createChannel(
      {
        userID: 'u1',
        channelID: 'a1',
        name: 'announcement test channel',
        desc: undefined,
        icon: undefined,
      },
      bindings,
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
      bindings,
    );

    {
      const c = await db.getChannel({ userID: 'u1', channelID: 'a1' }, bindings);
      assert(c);

      const announcementID = c.announcementIDs?.shift() ?? '';

      const a = await db.getAnnouncement(
        {
          channelID: 'a1',
          announcementID,
        },
        bindings,
      );
      assert(a);

      expect(a).toMatchObject({
        title: 'test',
        body: 'This is test',
      });

      const b = await db.getStorage(a.headerImage ?? '', bindings);
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
        bindings,
      );
    }

    {
      const c = await db.getChannel({ userID: 'u1', channelID: 'a1' }, bindings);
      assert(c);

      const announcementID = c.announcementIDs?.shift() ?? '';

      const a = await db.getAnnouncement(
        {
          channelID: 'a1',
          announcementID,
        },
        bindings,
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
        bindings,
      );

      expect(
        await db.getAnnouncement(
          {
            channelID: 'a1',
            announcementID,
          },
          bindings,
        ),
      ).toBeUndefined();
    }
  });
});
