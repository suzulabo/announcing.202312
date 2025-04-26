import { assert, describe, expect, test } from 'vitest';

import { openAsBlob } from 'fs';
import { createDB } from '../src';
import { createLocalBindings } from '../src/db/localBindings';

describe('Channel', () => {
  test('create, update and delete', async () => {
    const db = await createDB('', false);
    const bindings = await createLocalBindings(true);

    await db.createChannel(bindings, {
      userID: 'u1',
      channelID: '1',
      name: 'test channel',
      desc: 'This is test',
      icon: await openAsBlob('tests/board-361516_1280.jpg', { type: 'image/jpeg' }),
    });
    expect(await db.getChannel(bindings, { userID: 'u2', channelID: '1' })).toBeUndefined();

    {
      const c = await db.getChannel(bindings, { userID: 'u1', channelID: '1' });

      assert(c);

      expect(c).toMatchObject({
        channelID: '1',
        name: 'test channel',
        desc: 'This is test',
      });

      await db.updateChannel(bindings, {
        userID: 'u2',
        updatedAt: c.updatedAt,
        channelID: '1',
        name: 'should not update',
        desc: c.desc,
        icon: c.icon,
      });
      expect(await db.getChannel(bindings, { userID: 'u1', channelID: '1' })).toMatchObject({
        channelID: '1',
        name: 'test channel',
        desc: 'This is test',
      });

      await db.updateChannel(bindings, {
        userID: 'u1',
        updatedAt: c.updatedAt,
        channelID: '1',
        name: 'update channel',
        desc: 'updated',
        icon: undefined,
      });
    }
    {
      const c = await db.getChannel(bindings, { userID: 'u1', channelID: '1' });

      assert(c);

      expect(c).toMatchObject({
        channelID: '1',
        name: 'update channel',
        desc: 'updated',
        icon: undefined,
      });

      await db.deleteChannel(bindings, { userID: 'u2', channelID: '1', updatedAt: c.updatedAt });
      expect(await db.getChannel(bindings, { userID: 'u1', channelID: '1' })).toMatchObject({
        channelID: '1',
        name: 'update channel',
        desc: 'updated',
        icon: undefined,
      });

      await db.deleteChannel(bindings, { userID: 'u1', channelID: '1', updatedAt: c.updatedAt });
      expect(await db.getChannel(bindings, { userID: 'u1', channelID: '1' })).toBeUndefined();
    }
  });

  test('Too many channels', async () => {
    const db = await createDB('', false);
    const bindings = await createLocalBindings(true);

    for (let i = 1; i <= 6; i++) {
      await db.createChannel(bindings, {
        userID: 'u1',
        channelID: i.toString(),
        name: `channel${i}`,
        desc: undefined,
        icon: undefined,
      });
    }

    const channels = await db.getChannels(bindings, { userID: 'u1' });
    expect(channels.length).toEqual(5);
  });

  test('empty name', async () => {
    const db = await createDB('', false);
    const bindings = await createLocalBindings(true);

    await expect(
      db.createChannel(bindings, {
        userID: '1',
        channelID: '1',
        name: '',
        desc: undefined,
        icon: undefined,
      }),
    ).rejects.toBeInstanceOf(Error);
  });

  test('check channel left', async () => {
    const db = await createDB('', false);
    const bindings = await createLocalBindings(true);

    const c = await db.getChannel(bindings, { userID: 'u1', channelID: '1' });
    expect(c).toBeUndefined();
  });
});
