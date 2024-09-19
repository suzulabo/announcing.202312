import { assert, expect, test, vi } from 'vitest';

import { addAnnouncement, createChannel, getAnnouncement, getBlob, getChannel } from '../src';

test('add', async () => {
  vi.mock('../src/client');
  await createChannel('u1', 'a1', 'announcement test channel', undefined, undefined);

  await addAnnouncement(
    'u1',
    'a1',
    new Blob(['headerImage'], { type: 'image/test' }),
    'test',
    'This is test',
    [new Blob(['images1'], { type: 'image/test' })],
    new Date(),
  );

  const c = await getChannel('u1', 'a1');
  assert(c);

  const a = await getAnnouncement('a1', c.announcementIDs?.shift() ?? '');
  assert(a);

  expect(a).toMatchObject({
    channelID: 'a1',
    title: 'test',
    body: 'This is test',
  });

  const b = await getBlob(a.headerImage ?? '');
  assert(b);
});
