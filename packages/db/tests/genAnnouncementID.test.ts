import { expect, test } from 'vitest';
import { genAnnouncementID } from '../src/utils';

test('normal', () => {
  expect(genAnnouncementID(new Date('2024-01-01T00:00:00+00:00').getTime())).toEqual('');
  expect(genAnnouncementID(new Date('2025-01-01T00:00:00+00:00').getTime())).toEqual('');
  expect(genAnnouncementID(new Date('2025-01-01T00:00:01+00:00').getTime())).toEqual('1');
  expect(genAnnouncementID(new Date('2026-01-01T00:00:00+00:00').getTime())).toEqual('1uJE0');
  expect(genAnnouncementID(new Date('2026-01-01T00:00:01+00:00').getTime())).toEqual('1uJE1');
  expect(genAnnouncementID(new Date('2100-01-01T00:00:01+00:00').getTime())).toEqual('2D4T61');
});

test('suffix', () => {
  expect(genAnnouncementID(new Date('2025-01-01T00:00:01+00:00').getTime(), '1')).toEqual('1/1');
  expect(genAnnouncementID(new Date('2025-01-01T00:00:01+00:00').getTime(), '1/1')).toEqual('1/2');
});

test('invalid ID', () => {
  expect(() => genAnnouncementID(new Date('2025-01-01T00:00:01+00:00').getTime(), '2')).toThrow();
  expect(() => genAnnouncementID(new Date('2025-01-01T00:00:01+00:00').getTime(), '2/1')).toThrow();
});
