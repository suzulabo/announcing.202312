import { genToml } from '../lib/genToml'
import { runCommand } from '../lib/runCommand'

function main() {
  genToml()
  runCommand('wrangler pages dev ../writer/.svelte-kit/cloudflare')
}

main()
