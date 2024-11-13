import { assert, beforeEach, describe, expect, test } from 'vitest';

import { openAsBlob } from 'fs';
import { ValiError } from 'valibot';
import { getChannels } from '../src';
import { createChannel } from '../src/api/channel/createChannel';
import { deleteChannel } from '../src/api/channel/deleteChannel';
import { getChannel } from '../src/api/channel/getChannel';
import { updateChannel } from '../src/api/channel/updateChannel';
import { setupDB } from './setupDB';

describe('Channel', () => {
  beforeEach(async () => {
    await setupDB();
  });

  test('create, update and delete', async () => {
    await setupDB();

    await createChannel({
      userID: 'u1',
      channelID: '1',
      name: 'test channel',
      desc: 'This is test',
      icon: await openAsBlob('tests/board-361516_1280.jpg', { type: 'image/jpeg' }),
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

  test('check channel left', async () => {
    const c = await getChannel({ userID: 'u1', channelID: '1' });
    expect(c).toBeUndefined();
  });
});
