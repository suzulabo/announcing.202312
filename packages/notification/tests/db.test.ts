import { expect, test } from 'vitest';
import { createDB } from '../src/db/db';
import { createLocalBindings } from '../src/local/localBindings';

test('set and unset', async () => {
  const db = createDB();
  const bindings = await createLocalBindings(true);
  const d1 = bindings.D1_NOTIFICATION;

  await db.putToken({ token: 'token1', tags: ['123', '456'] }, bindings);
  expect((await d1.prepare('SELECT * FROM tokens').all()).results).toStrictEqual([
    { token: 'token1', tags: '123:1 456:1' },
  ]);
  expect((await d1.prepare('SELECT * FROM tags').all()).results).toStrictEqual([
    { tag: '123', sub: 1, tokens: 'token1 ', count: 1, tail: 1 },
    { tag: '456', sub: 1, tokens: 'token1 ', count: 1, tail: 1 },
  ]);
  await db.putToken({ token: 'token1', tags: ['123'] }, bindings);
  expect((await d1.prepare('SELECT * FROM tokens').all()).results).toStrictEqual([
    { token: 'token1', tags: '123:1' },
  ]);
  expect((await d1.prepare('SELECT * FROM tags').all()).results).toStrictEqual([
    { tag: '123', sub: 1, tokens: 'token1 ', count: 1, tail: 1 },
    { tag: '456', sub: 1, tokens: '', count: 0, tail: 1 },
  ]);
});

test('exceed maxTokens', async () => {
  const db = createDB(10);
  const bindings = await createLocalBindings(true);
  const d1 = bindings.D1_NOTIFICATION;

  for (let i = 1; i <= 31; i++) {
    await db.putToken({ token: `token${i}`, tags: ['123'] }, bindings);
  }

  expect(
    (await d1.prepare('SELECT sub, count, tail FROM tags ORDER BY sub').all()).results,
  ).toStrictEqual([
    { sub: 1, count: 10, tail: 0 },
    { sub: 2, count: 10, tail: 0 },
    { sub: 3, count: 10, tail: 0 },
    { sub: 4, count: 1, tail: 1 },
  ]);

  const cbInfo = {
    called: 0,
    tokens: 0,
  };
  await db.readTokens(
    {
      tag: '123',
      callback: (tokens) => {
        cbInfo.called++;
        cbInfo.tokens += tokens.length;
      },
      chunkSize: 5,
    },
    bindings,
  );
  expect(cbInfo).toStrictEqual({ called: 7, tokens: 31 });
});

test('delete tokens', async () => {
  const db = createDB();
  const bindings = await createLocalBindings(true);
  const d1 = bindings.D1_NOTIFICATION;

  await db.putToken({ token: 'token1', tags: ['123', '456'] }, bindings);
  await db.putToken({ token: 'token2', tags: ['456', '789'] }, bindings);
  await db.deleteTokens({ tokens: ['token1', 'token2'] }, bindings);

  expect((await d1.prepare('SELECT * FROM tokens').all()).results).toStrictEqual([]);
  expect(
    (await d1.prepare('SELECT tag, sub, count FROM tags ORDER BY tag').all()).results,
  ).toStrictEqual([
    { tag: '123', sub: 1, count: 0 },
    { tag: '456', sub: 1, count: 0 },
    { tag: '789', sub: 1, count: 0 },
  ]);
});

test('delete large token', async () => {
  const db = createDB();
  const bindings = await createLocalBindings(true);
  const d1 = bindings.D1_NOTIFICATION;

  const tags = Array.from({ length: 30 }, (_, i) => (i + 1).toString());

  await db.putToken({ token: 'token1', tags }, bindings);
  await db.putToken({ token: 'token2', tags }, bindings);
  await db.deleteTokens({ tokens: ['token1', 'token2'] }, bindings);
  expect((await d1.prepare('SELECT * FROM tags WHERE count > 0').all()).results).toStrictEqual([]);
});

test('set empty tags', async () => {
  const db = createDB();
  const bindings = await createLocalBindings(true);
  const d1 = bindings.D1_NOTIFICATION;

  await db.putToken({ token: 'token1', tags: ['123', '456'] }, bindings);
  await db.putToken({ token: 'token1', tags: [] }, bindings);
  expect((await d1.prepare('SELECT * FROM tokens').all()).results).toStrictEqual([]);
});

test.skip('put performance', async () => {
  // 150 characters
  const TOKEN =
    'TEXGe2qhWK1KhcFcRPB3QUDh9MizZPQzzT8Y07X27H5Dbpp8BA6zXB23NPKHt353tUESBFwUy56KffRJx4XZPqA6fC2qUEV3aree370ZVDPLEzPvyv6mJ9C8jbdhZEUBxxYiGA0n5QbzrJgda2TWfV';

  const db = createDB();
  const bindings = await createLocalBindings(false);

  {
    const start = performance.now();
    await db.putToken({ token: `${TOKEN}A`, tags: ['123'] }, bindings);
    const end = performance.now();
    console.log(`[PERF] tokenA ${end - start}ms`);
  }

  {
    const start = performance.now();
    await db.putToken({ token: `${TOKEN}B`, tags: ['123'] }, bindings);
    const end = performance.now();
    console.log(`[PERF] tokenB ${end - start}ms`);
  }

  for (let i = 1; i <= 100000; i++) {
    await db.putToken({ token: `${TOKEN}${i}`, tags: ['123'] }, bindings);
  }

  {
    //store.config.debug = true;
    const start = performance.now();
    await db.putToken({ token: `${TOKEN}Z`, tags: ['123'] }, bindings);
    const end = performance.now();
    console.log(`[PERF] tokenZ ${end - start}ms`);
  }

  {
    const start = performance.now();
    await db.putToken({ token: `${TOKEN}A`, tags: ['123', '456'] }, bindings);
    const end = performance.now();
    console.log(`[PERF] tokenA2 ${end - start}ms`);
  }
});
