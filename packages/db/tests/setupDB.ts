import { setDBEnv } from '../src/api';
import { createLocalDB } from '../src/lib/localDB';

export const setupDB = async () => {
  setDBEnv(await createLocalDB({ inMemory: true, migration: true }));
};
