import { assert, expect, test, vi } from 'vitest';

import { addAnnouncement, createChannel, getAnnouncement, getBlob, getChannel } from '../src';

test('add', async () => {
  vi.mock('../src/client');
  await createChannel({ userID: 'u1', channelID: 'a1', name: 'announcement test channel' });

  await addAnnouncement({
    userID: 'u1',
    channelID: 'a1',
    headerImageFile: new Blob(['headerImage'], { type: 'image/test' }),
    title: 'test',
    body: 'This is test',
    imagesFiles: [new Blob(['images1'], { type: 'image/test' })],
    createdAt: new Date(),
  });

  const c = await getChannel({ userID: 'u1', channelID: 'a1' });
  assert(c);

  const a = await getAnnouncement({
    channelID: 'a1',
    announcementID: c.announcementIDs?.shift() ?? '',
  });
  assert(a);

  expect(a).toMatchObject({
    channelID: 'a1',
    title: 'test',
    body: 'This is test',
  });

  const b = await getBlob(a.headerImage ?? '');
  assert(b);
});
