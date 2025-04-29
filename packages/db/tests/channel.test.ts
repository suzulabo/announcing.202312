import { assert, describe, expect, test } from 'vitest';

import { openAsBlob } from 'fs';
import { createDB } from '../src';
import { createLocalBindings } from '../src/local/localBindings';

describe('Channel', () => {
  test('create, update and delete', async () => {
    const db = createDB('');
    const bindings = await createLocalBindings(true);

    await db.createChannel(
      {
        userID: 'u1',
        channelID: '1',
        name: 'test channel',
        desc: 'This is test',
        icon: await openAsBlob('tests/board-361516_1280.jpg', { type: 'image/jpeg' }),
      },
      bindings,
    );
    expect(await db.getChannel({ userID: 'u2', channelID: '1' }, bindings)).toBeUndefined();

    {
      const c = await db.getChannel({ userID: 'u1', channelID: '1' }, bindings);

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
        bindings,
      );
      expect(await db.getChannel({ userID: 'u1', channelID: '1' }, bindings)).toMatchObject({
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
        bindings,
      );
    }
    {
      const c = await db.getChannel({ userID: 'u1', channelID: '1' }, bindings);

      assert(c);

      expect(c).toMatchObject({
        channelID: '1',
        name: 'update channel',
        desc: 'updated',
        icon: undefined,
      });

      await db.deleteChannel({ userID: 'u2', channelID: '1', updatedAt: c.updatedAt }, bindings);
      expect(await db.getChannel({ userID: 'u1', channelID: '1' }, bindings)).toMatchObject({
        channelID: '1',
        name: 'update channel',
        desc: 'updated',
        icon: undefined,
      });

      await db.deleteChannel({ userID: 'u1', channelID: '1', updatedAt: c.updatedAt }, bindings);
      expect(await db.getChannel({ userID: 'u1', channelID: '1' }, bindings)).toBeUndefined();
    }
  });

  test('Too many channels', async () => {
    const db = createDB('');
    const bindings = await createLocalBindings(true);

    for (let i = 1; i <= 6; i++) {
      await db.createChannel(
        {
          userID: 'u1',
          channelID: i.toString(),
          name: `channel${i}`,
          desc: undefined,
          icon: undefined,
        },
        bindings,
      );
    }

    const channels = await db.getChannels({ userID: 'u1' }, bindings);
    expect(channels.length).toEqual(5);
  });

  test('empty name', async () => {
    const db = createDB('');
    const bindings = await createLocalBindings(true);

    await expect(
      db.createChannel(
        {
          userID: '1',
          channelID: '1',
          name: '',
          desc: undefined,
          icon: undefined,
        },
        bindings,
      ),
    ).rejects.toBeInstanceOf(Error);
  });

  test('check channel left', async () => {
    const db = createDB('');
    const bindings = await createLocalBindings(true);

    const c = await db.getChannel({ userID: 'u1', channelID: '1' }, bindings);
    expect(c).toBeUndefined();
  });
});
