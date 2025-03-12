import { genToml } from '../lib/genToml'
import { runCommand } from '../lib/runCommand'

function main() {
  genToml()
  runCommand('wrangler pages dev ../reader/.svelte-kit/cloudflare')
}

main()
