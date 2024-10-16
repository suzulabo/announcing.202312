import { assert, describe, expect, test, vi } from 'vitest';

import { ValiError } from 'valibot';
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
      icon: new Blob(['aaa'], { type: 'image/test' }),
    });
    expect(await getChannel({ userID: 'u2', channelID: '1' })).toBeUndefined();

    {
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
        desc: c.desc,
        icon: c.icon,
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
        icon: undefined,
      });
    }
    {
      const c = await getChannel({ userID: 'u1', channelID: '1' });

      assert(c);

      expect(c).toMatchObject({
        channelID: '1',
        name: 'update channel',
        desc: 'updated',
        icon: undefined,
      });

      await deleteChannel({ userID: 'u2', channelID: '1', updatedAt: c.updatedAt });
      expect(await getChannel({ userID: 'u1', channelID: '1' })).toMatchObject({
        channelID: '1',
        name: 'update channel',
        desc: 'updated',
        icon: undefined,
      });

      await deleteChannel({ userID: 'u1', channelID: '1', updatedAt: c.updatedAt });
      expect(await getChannel({ userID: 'u1', channelID: '1' })).toBeUndefined();
    }
  });

  test('Too many channels', async () => {
    vi.mock('../src/client');

    for (let i = 1; i <= 6; i++) {
      await createChannel({
        userID: 'u1',
        channelID: i.toString(),
        name: `channel${i}`,
        desc: undefined,
        icon: undefined,
      });
    }

    const channels = await getChannels({ userID: 'u1' });
    expect(channels.length).toEqual(5);
  });

  test('empty name', async () => {
    await expect(
      createChannel({
        userID: '1',
        channelID: '1',
        name: '',
        desc: undefined,
        icon: undefined,
      }),
    ).rejects.toBeInstanceOf(ValiError);
  });
});
