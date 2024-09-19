import { assert, describe, expect, test, vi } from 'vitest';

import { getChannels } from '../src';
import { createChannel } from '../src/api/channel/createChannel';
import { deleteChannel } from '../src/api/channel/deleteChannel';
import { getChannel } from '../src/api/channel/getChannel';
import { updateChannel } from '../src/api/channel/updateChannel';

describe('Channel', () => {
  test('create, update and delete', async () => {
    vi.mock('../src/client');
    await createChannel(
      'u1',
      '1',
      'test channel',
      'This is test',
      new Blob(['aaa'], { type: 'image/test' }),
    );
    expect(await getChannel('u2', '1')).toBeUndefined();

    const c = await getChannel('u1', '1');

    assert(c);

    expect(c).toMatchObject({
      channelID: '1',
      name: 'test channel',
      desc: 'This is test',
    });

    await updateChannel('u2', c.updatedAt, '1', 'should not update', undefined, undefined);
    expect(await getChannel('u1', '1')).toMatchObject({
      channelID: '1',
      name: 'test channel',
      desc: 'This is test',
    });

    await updateChannel(
      'u1',
      c.updatedAt,
      '1',
      'update channel',
      'updated',
      new Blob(['aaa'], { type: 'image/test' }),
    );
    expect(await getChannel('u1', '1')).toMatchObject({
      channelID: '1',
      name: 'update channel',
      desc: 'updated',
    });

    await deleteChannel('u2', '1', c.updatedAt);
    expect(await getChannel('u1', '1')).toMatchObject({
      channelID: '1',
      name: 'update channel',
      desc: 'updated',
    });

    await deleteChannel('u1', '1', c.updatedAt);
    expect(await getChannel('u1', '1')).toBeUndefined();
  });

  test('Too many channels', async () => {
    vi.mock('../src/client');

    for (let i = 1; i <= 6; i++) {
      await createChannel('u1', i.toString(), `channel${i}`, undefined, undefined);
    }

    const channels = await getChannels('u1');
    expect(channels.length).toEqual(5);
  });
});
