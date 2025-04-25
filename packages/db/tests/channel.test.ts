import { assert, beforeEach, describe, expect, test } from 'vitest';

import { openAsBlob } from 'fs';
import { createChannel, deleteChannel, getChannel, getChannels, updateChannel } from '../src';
import { setupDB } from './setupDB';

describe('Channel', () => {
  beforeEach(async () => {
    await setupDB();
  });

  test('create, update and delete', async () => {
    const { db, storage } = await setupDB();

    await createChannel(db, storage, {
      userID: 'u1',
      channelID: '1',
      name: 'test channel',
      desc: 'This is test',
      icon: await openAsBlob('tests/board-361516_1280.jpg', { type: 'image/jpeg' }),
    });
    expect(await getChannel(db, { userID: 'u2', channelID: '1' })).toBeUndefined();

    {
      const c = await getChannel(db, { userID: 'u1', channelID: '1' });

      assert(c);

      expect(c).toMatchObject({
        channelID: '1',
        name: 'test channel',
        desc: 'This is test',
      });

      await updateChannel(db, storage, {
        userID: 'u2',
        updatedAt: c.updatedAt,
        channelID: '1',
        name: 'should not update',
        desc: c.desc,
        icon: c.icon,
      });
      expect(await getChannel(db, { userID: 'u1', channelID: '1' })).toMatchObject({
        channelID: '1',
        name: 'test channel',
        desc: 'This is test',
      });

      await updateChannel(db, storage, {
        userID: 'u1',
        updatedAt: c.updatedAt,
        channelID: '1',
        name: 'update channel',
        desc: 'updated',
        icon: undefined,
      });
    }
    {
      const c = await getChannel(db, { userID: 'u1', channelID: '1' });

      assert(c);

      expect(c).toMatchObject({
        channelID: '1',
        name: 'update channel',
        desc: 'updated',
        icon: undefined,
      });

      await deleteChannel(db, { userID: 'u2', channelID: '1', updatedAt: c.updatedAt });
      expect(await getChannel(db, { userID: 'u1', channelID: '1' })).toMatchObject({
        channelID: '1',
        name: 'update channel',
        desc: 'updated',
        icon: undefined,
      });

      await deleteChannel(db, { userID: 'u1', channelID: '1', updatedAt: c.updatedAt });
      expect(await getChannel(db, { userID: 'u1', channelID: '1' })).toBeUndefined();
    }
  });

  test('Too many channels', async () => {
    const { db, storage } = await setupDB();
    for (let i = 1; i <= 6; i++) {
      await createChannel(db, storage, {
        userID: 'u1',
        channelID: i.toString(),
        name: `channel${i}`,
        desc: undefined,
        icon: undefined,
      });
    }

    const channels = await getChannels(db, { userID: 'u1' });
    expect(channels.length).toEqual(5);
  });

  test('empty name', async () => {
    const { db, storage } = await setupDB();
    await expect(
      createChannel(db, storage, {
        userID: '1',
        channelID: '1',
        name: '',
        desc: undefined,
        icon: undefined,
      }),
    ).rejects.toBeInstanceOf(Error);
  });

  test('check channel left', async () => {
    const { db } = await setupDB();
    const c = await getChannel(db, { userID: 'u1', channelID: '1' });
    expect(c).toBeUndefined();
  });
});
