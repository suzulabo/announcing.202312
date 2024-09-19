import { assert, describe, expect, test, vi } from 'vitest';

import { getChannels } from '../src';
import { createChannel } from '../src/api/channel/createChannel';
import { deleteChannel } from '../src/api/channel/deleteChannel';
import { getChannel } from '../src/api/channel/getChannel';
import { updateChannel } from '../src/api/channel/updateChannel';

describe('Channel', () => {
  test('create, update and delete', async () => {
    vi.mock('../src/client');
    await createChannel({
      userID: 'u1',
      channelID: '1',
      name: 'test channel',
      desc: 'This is test',
      iconFile: new Blob(['aaa'], { type: 'image/test' }),
    });
    expect(await getChannel({ userID: 'u2', channelID: '1' })).toBeUndefined();

    const c = await getChannel({ userID: 'u1', channelID: '1' });

    assert(c);

    expect(c).toMatchObject({
      channelID: '1',
      name: 'test channel',
      desc: 'This is test',
    });

    await updateChannel({
      userID: 'u2',
      updatedAt: c.updatedAt,
      channelID: '1',
      name: 'should not update',
    });
    expect(await getChannel({ userID: 'u1', channelID: '1' })).toMatchObject({
      channelID: '1',
      name: 'test channel',
      desc: 'This is test',
    });

    await updateChannel({
      userID: 'u1',
      updatedAt: c.updatedAt,
      channelID: '1',
      name: 'update channel',
      desc: 'updated',
      iconFile: new Blob(['aaa'], { type: 'image/test' }),
    });
    expect(await getChannel({ userID: 'u1', channelID: '1' })).toMatchObject({
      channelID: '1',
      name: 'update channel',
      desc: 'updated',
    });

    await deleteChannel({ userID: 'u2', channelID: '1', updatedAt: c.updatedAt });
    expect(await getChannel({ userID: 'u1', channelID: '1' })).toMatchObject({
      channelID: '1',
      name: 'update channel',
      desc: 'updated',
    });

    await deleteChannel({ userID: 'u1', channelID: '1', updatedAt: c.updatedAt });
    expect(await getChannel({ userID: 'u1', channelID: '1' })).toBeUndefined();
  });

  test('Too many channels', async () => {
    vi.mock('../src/client');

    for (let i = 1; i <= 6; i++) {
      await createChannel({ userID: 'u1', channelID: i.toString(), name: `channel${i}` });
    }

    const channels = await getChannels({ userID: 'u1' });
    expect(channels.length).toEqual(5);
  });
});
