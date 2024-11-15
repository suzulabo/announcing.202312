import { DATABASE_NAME } from '../env';
import { genToml } from './genToml';
import { runCommand } from './runCommand';

const main = () => {
  genToml();
  runCommand(`wrangler d1 migrations apply ${DATABASE_NAME}`);
};

main();
