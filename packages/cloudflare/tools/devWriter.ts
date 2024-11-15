import { genToml } from './genToml';
import { runCommand } from './runCommand';

const main = () => {
  genToml();
  runCommand('wrangler pages dev ../writer/.svelte-kit/cloudflare');
};

main();
