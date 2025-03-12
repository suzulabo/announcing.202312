import type { SpawnOptions } from 'node:child_process'
import { spawn } from 'node:child_process'

export function runCommand(command: string) {
  const options: SpawnOptions = { stdio: 'inherit' }

  const process = spawn('pnpm', ['exec'].concat(command.split(' ')), options)

  process.on('error', (error: Error) => {
    console.error(`Error: ${error.message}`)
  })
}
