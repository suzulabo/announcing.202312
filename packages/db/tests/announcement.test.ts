import { assert, expect, test, vi } from 'vitest';

import {
  addAnnouncement,
  createChannel,
  getAnnouncement,
  getBlob,
  getChannel,
  removeAnnouncement,
  updateAnnouncement,
} from '../src';

test('add, update and remove', async () => {
  vi.mock('../src/client');
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
    headerImageFile: new Blob(['headerImage'], { type: 'image/test' }),
    title: 'test',
    body: 'This is test',
    imagesFiles: [new Blob(['images1'], { type: 'image/test' })],
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

    const b = await getBlob(a.headerImage ?? '');
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
