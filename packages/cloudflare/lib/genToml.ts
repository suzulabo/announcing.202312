import { writeFileSync } from 'node:fs'
import { DATABASE_ID, DATABASE_NAME } from '../env'

const toml = `
compatibility_flags = [ "nodejs_compat" ]
compatibility_date = "2024-09-23"
upload_source_maps = true

[[d1_databases]]
binding = "DB"
database_name = "${DATABASE_NAME}"
database_id = "${DATABASE_ID}"
migrations_dir = "../db/drizzle"
`

export function genToml() {
  writeFileSync('wrangler.toml', toml)
}
