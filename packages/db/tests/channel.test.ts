import { assert, describe, expect, test } from 'vitest';

import { openAsBlob } from 'fs';
import { createLocalDB } from '../src/db/localDB';

describe('Channel', () => {
  test('create, update and delete', async () => {
    const db = await createLocalDB(true);

    await db.createChannel(
      {
        userID: 'u1',
        channelID: '1',
        name: 'test channel',
        desc: 'This is test',
        icon: await openAsBlob('tests/board-361516_1280.jpg', { type: 'image/jpeg' }),
      },
      undefined,
    );
    expect(await db.getChannel({ userID: 'u2', channelID: '1' }, undefined)).toBeUndefined();

    {
      const c = await db.getChannel({ userID: 'u1', channelID: '1' }, undefined);

      assert(c);

      expect(c).toMatchObject({
        channelID: '1',
        name: 'test channel',
        desc: 'This is test',
      });

      await db.updateChannel(
        {
          userID: 'u2',
          updatedAt: c.updatedAt,
          channelID: '1',
          name: 'should not update',
          desc: c.desc,
          icon: c.icon,
        },
        undefined,
      );
      expect(await db.getChannel({ userID: 'u1', channelID: '1' }, undefined)).toMatchObject({
        channelID: '1',
        name: 'test channel',
        desc: 'This is test',
      });

      await db.updateChannel(
        {
          userID: 'u1',
          updatedAt: c.updatedAt,
          channelID: '1',
          name: 'update channel',
          desc: 'updated',
          icon: undefined,
        },
        undefined,
      );
    }
    {
      const c = await db.getChannel({ userID: 'u1', channelID: '1' }, undefined);

      assert(c);

      expect(c).toMatchObject({
        channelID: '1',
        name: 'update channel',
        desc: 'updated',
        icon: undefined,
      });

      await db.deleteChannel({ userID: 'u2', channelID: '1', updatedAt: c.updatedAt }, undefined);
      expect(await db.getChannel({ userID: 'u1', channelID: '1' }, undefined)).toMatchObject({
        channelID: '1',
        name: 'update channel',
        desc: 'updated',
        icon: undefined,
      });

      await db.deleteChannel({ userID: 'u1', channelID: '1', updatedAt: c.updatedAt }, undefined);
      expect(await db.getChannel({ userID: 'u1', channelID: '1' }, undefined)).toBeUndefined();
    }
  });

  test('Too many channels', async () => {
    const db = await createLocalDB(true);

    for (let i = 1; i <= 6; i++) {
      await db.createChannel(
        {
          userID: 'u1',
          channelID: i.toString(),
          name: `channel${i}`,
          desc: undefined,
          icon: undefined,
        },
        undefined,
      );
    }

    const channels = await db.getChannels({ userID: 'u1' }, undefined);
    expect(channels.length).toEqual(5);
  });

  test('empty name', async () => {
    const db = await createLocalDB(true);

    await expect(
      db.createChannel(
        {
          userID: '1',
          channelID: '1',
          name: '',
          desc: undefined,
          icon: undefined,
        },
        undefined,
      ),
    ).rejects.toBeInstanceOf(Error);
  });

  test('check channel left', async () => {
    const db = await createLocalDB(true);

    const c = await db.getChannel({ userID: 'u1', channelID: '1' }, undefined);
    expect(c).toBeUndefined();
  });
});
