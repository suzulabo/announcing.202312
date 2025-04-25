import { test } from 'vitest';
import { createLocalBindings } from '../src/db/localBindings';

test('createLocalBindings', async () => {
  await createLocalBindings();
});
