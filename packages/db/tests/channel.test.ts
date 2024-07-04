import { assert, describe, expect, test, vi } from 'vitest';

import { createChannel } from '../src/api/channel/createChannel';
import { deleteChannel } from '../src/api/channel/deleteChannel';
import { getChannel } from '../src/api/channel/getChannel';
import { updateChannel } from '../src/api/channel/updateChannel';

describe('Channel', () => {
  test('create, update and delete', async () => {
    vi.mock('../src/client');
    await createChannel('u1', '1', 'a', null, null);
    expect(await getChannel('u2', '1')).toBeUndefined();

    const c = await getChannel('u1', '1');

    assert(c);
    expect(c).toMatchObject({
      channelID: '1',
      title: 'a',
      desc: null,
      icon: null,
      owners: ['u1'],
    });

    await updateChannel('u2', c.updatedAt, '1', 'b', null, null);
    expect(await getChannel('u1', '1')).toMatchObject({
      channelID: '1',
      title: 'a',
      desc: null,
      icon: null,
      owners: ['u1'],
    });

    await updateChannel('u1', c.updatedAt, '1', 'b', null, null);
    expect(await getChannel('u1', '1')).toMatchObject({
      channelID: '1',
      title: 'b',
      desc: null,
      icon: null,
      owners: ['u1'],
    });

    await deleteChannel('u2', '1', c.updatedAt);
    expect(await getChannel('u1', '1')).toMatchObject({
      channelID: '1',
      title: 'b',
      desc: null,
      icon: null,
      owners: ['u1'],
    });

    await deleteChannel('u1', '1', c.updatedAt);
    expect(await getChannel('u1', '1')).toBeUndefined();
  });
});
