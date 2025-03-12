import { DATABASE_NAME } from '../env'
import { genToml } from '../lib/genToml'
import { runCommand } from '../lib/runCommand'

function main() {
  genToml()
  runCommand(`wrangler d1 migrations apply ${DATABASE_NAME}`)
}

main()
