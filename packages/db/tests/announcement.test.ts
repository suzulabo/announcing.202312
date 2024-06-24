import { test, vi } from 'vitest';
import { addAnnouncement } from '../src/api/announcement/addAnnouncement';

test('add', async () => {
  vi.mock('../src/client');
  await addAnnouncement('', '', 0, null, null, '', null);
});
