import { setDBEnv } from '../src/client';
import { createLocalDB } from '../src/lib/createLocalDB';

export const setupDB = async () => {
  setDBEnv(await createLocalDB(true));
};
