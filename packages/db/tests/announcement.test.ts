import { test, vi } from 'vitest';

import { addAnnouncement, createChannel } from '../src';

test('add', async () => {
  vi.mock('../src/client');
  await createChannel('u1', 'a1', 'announcement test channel', undefined, undefined);

  await addAnnouncement(
    'u1',
    '1',
    new Blob(['headerImage'], { type: 'image/test' }),
    'test',
    'This is test',
    [new Blob(['images1'], { type: 'image/test' })],
    new Date(),
  );
});
