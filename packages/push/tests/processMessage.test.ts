import { describe, expect, test, vi } from 'vitest';
import { processMessage } from '../src/core/processMessage';
import { createLibSqlTokenStore } from '../src/tokenStores/libsql/libsqlTokenStore';
import { createTestClient } from './createTestClient';

describe('processMessage', () => {
  test('send message', async () => {
    const client = await createTestClient();

    const tokenStore = createLibSqlTokenStore({ client });
    const createSendMessageTaskFn = vi.fn();
    const taskManager = {
      createSendMessageTask: createSendMessageTaskFn,
    };

    await tokenStore.putToken('token1', ['123', '456']);

    const message = {
      notification: {
        title: 'hello',
        body: 'hi',
      },
    };

    await processMessage(
      {
        tokenStore,
        taskManager,
      },
      '123',
      message,
    );

    expect(createSendMessageTaskFn).toBeCalledTimes(1);
    expect(createSendMessageTaskFn.mock.lastCall?.[0]).toString();
    expect(createSendMessageTaskFn.mock.lastCall?.[1]).toStrictEqual({
      tokens: ['token1'],
      ...message,
    });
  });

  test('lots of tokens', async () => {
    const client = await createTestClient();

    const tokenStore = createLibSqlTokenStore({ client });
    const createSendMessageTaskFn = vi.fn();
    const taskManager = {
      createSendMessageTask: createSendMessageTaskFn,
    };

    for (let i = 1; i <= 1000; i++) {
      await tokenStore.putToken(`token${i}`, ['123']);
    }

    const message = {
      notification: {
        title: 'hello',
        body: 'hi',
      },
    };

    await processMessage(
      {
        tokenStore,
        taskManager,
      },
      '123',
      message,
    );

    expect(createSendMessageTaskFn).toBeCalledTimes(2);
  });
});
