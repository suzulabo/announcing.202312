import { createDB } from '../src';
import { createStorage } from '../src/db/db';
import { createLocalBindings } from '../src/db/localDB';

export const setupDB = async () => {
  const { d1, r2 } = await createLocalBindings(true);

  const db = await createDB(d1);
  const storage = await createStorage(r2);

  return { db, storage };
};
