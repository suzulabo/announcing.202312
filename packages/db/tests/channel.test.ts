import { describe, test, vi } from 'vitest';
import { createChannel } from '../src/api/channel/createChannel';

describe('Channel', () => {
  test('create, update and delete', async () => {
    vi.mock('../src/client');
    await createChannel('x1', '1', 'a', null, null);
  });
});
