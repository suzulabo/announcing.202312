import { setDBEnv } from '../src/api';
import { createLocalDB } from '../src/lib/localDB';

const main = async () => {
  setDBEnv(await createLocalDB({ migration: true }));
};

await main();
