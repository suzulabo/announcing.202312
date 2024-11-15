import { genToml } from './genToml';
import { runCommand } from './runCommand';

const main = () => {
  genToml();
  runCommand('wrangler pages dev ../reader/.svelte-kit/cloudflare');
};

main();
