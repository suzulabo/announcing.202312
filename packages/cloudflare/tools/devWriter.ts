import { genToml } from '../lib/genToml';
import { runCommand } from '../lib/runCommand';

const main = () => {
  genToml();
  runCommand('wrangler pages dev ../writer/.svelte-kit/cloudflare');
};

main();
