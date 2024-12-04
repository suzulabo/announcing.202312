import { createClient } from '@libsql/client';
import { readFileSync } from 'node:fs';
import { describe, expect, test, vi } from 'vitest';
import { createLibSqlTokenStore } from '../src/tokenStores/libsql/libsqlTokenStore';

const schemas = readFileSync('src/tokenStores/libsql/schema.sql', 'utf8')
  .split(';')
  .filter((v) => {
    return !!v.trim();
  });

const createTestClient = async () => {
  const client = createClient({ url: ':memory:' });

  await client.migrate(schemas);

  return client;
};

describe('libsqlTokenStore', () => {
  test('set and unset', async () => {
    const client = await createTestClient();

    const store = createLibSqlTokenStore({ client });

    await store.putToken('token1', ['123', '456']);
    expect((await client.execute('SELECT * FROM tokens')).rows).toStrictEqual([
      { token: 'token1', tags: '123:1 456:1' },
    ]);
    expect((await client.execute('SELECT * FROM tags')).rows).toStrictEqual([
      { tag: '123', sub: 1, tokens: 'token1 ', count: 1, tail: 1 },
      { tag: '456', sub: 1, tokens: 'token1 ', count: 1, tail: 1 },
    ]);
    await store.putToken('token1', ['123']);
    expect((await client.execute('SELECT * FROM tokens')).rows).toStrictEqual([
      { token: 'token1', tags: '123:1' },
    ]);
    expect((await client.execute('SELECT * FROM tags')).rows).toStrictEqual([
      { tag: '123', sub: 1, tokens: 'token1 ', count: 1, tail: 1 },
      { tag: '456', sub: 1, tokens: '', count: 0, tail: 1 },
    ]);
  });

  test('exceed maxTokens', async () => {
    const client = await createTestClient();
    const store = createLibSqlTokenStore({ client, maxTokens: 10 });

    for (let i = 1; i <= 31; i++) {
      await store.putToken(`token${i}`, ['123']);
    }

    expect(
      (await client.execute('SELECT sub, count, tail FROM tags ORDER BY sub')).rows,
    ).toStrictEqual([
      { sub: 1, count: 10, tail: 0 },
      { sub: 2, count: 10, tail: 0 },
      { sub: 3, count: 10, tail: 0 },
      { sub: 4, count: 1, tail: 1 },
    ]);

    const reader = store.getTokensReader('123');
    expect((await reader())?.length).toEqual(10);
    expect((await reader())?.length).toEqual(10);
    expect((await reader())?.length).toEqual(10);
    expect((await reader())?.length).toEqual(1);
    expect(await reader()).toBeUndefined();
  });

  test('delete tokens', async () => {
    const client = await createTestClient();

    const store = createLibSqlTokenStore({ client });

    await store.putToken('token1', ['123', '456']);
    await store.putToken('token2', ['456', '789']);
    await store.deleteTokens(['token1', 'token2']);

    expect((await client.execute('SELECT * FROM tokens')).rows).toStrictEqual([]);
    expect(
      (await client.execute('SELECT tag, sub, count FROM tags ORDER BY tag')).rows,
    ).toStrictEqual([
      { tag: '123', sub: 1, count: 0 },
      { tag: '456', sub: 1, count: 0 },
      { tag: '789', sub: 1, count: 0 },
    ]);
  });

  test('delete large token', async () => {
    const client = await createTestClient();

    const store = createLibSqlTokenStore({ client });

    const tags = Array.from({ length: 30 }, (_, i) => (i + 1).toString());

    await store.putToken('token1', tags);
    await store.putToken('token2', tags);
    const spyBatch = vi.spyOn(client, 'batch');
    await store.deleteTokens(['token1', 'token2']);
    expect(spyBatch).toBeCalledTimes(2);
  });

  test('reader', async () => {
    const client = await createTestClient();

    const store = createLibSqlTokenStore({ client });

    {
      const reader = store.getTokensReader('tag');
      expect(await reader()).toBeUndefined();
    }

    {
      await store.putToken('token1', ['123']);
      await store.putToken('token1', []);
      const reader = store.getTokensReader('123');
      expect(await reader()).toBeUndefined();
    }
  });

  test.skip('put performance', async () => {
    // 150 characters
    const TOKEN =
      'TEXGe2qhWK1KhcFcRPB3QUDh9MizZPQzzT8Y07X27H5Dbpp8BA6zXB23NPKHt353tUESBFwUy56KffRJx4XZPqA6fC2qUEV3aree370ZVDPLEzPvyv6mJ9C8jbdhZEUBxxYiGA0n5QbzrJgda2TWfV';

    const client = await createTestClient();
    const store = createLibSqlTokenStore({ client });

    {
      const start = performance.now();
      await store.putToken(`${TOKEN}A`, ['123']);
      const end = performance.now();
      console.log(`[PERF] tokenA ${end - start}ms`);
    }

    {
      const start = performance.now();
      await store.putToken(`${TOKEN}B`, ['123']);
      const end = performance.now();
      console.log(`[PERF] tokenB ${end - start}ms`);
    }

    for (let i = 1; i <= 10000; i++) {
      await store.putToken(`${TOKEN}${i}`, ['123']);
    }

    {
      //store.config.debug = true;
      const start = performance.now();
      await store.putToken(`${TOKEN}Z`, ['123']);
      const end = performance.now();
      console.log(`[PERF] tokenZ ${end - start}ms`);
    }

    {
      const start = performance.now();
      await store.putToken(`${TOKEN}A`, ['123', '456']);
      const end = performance.now();
      console.log(`[PERF] tokenA2 ${end - start}ms`);
    }
  });
});
