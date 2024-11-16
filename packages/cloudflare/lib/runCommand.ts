import { spawn, type SpawnOptions } from 'child_process';

export const runCommand = (command: string) => {
  const options: SpawnOptions = { stdio: 'inherit' };

  const process = spawn('pnpm', ['exec'].concat(command.split(' ')), options);

  process.on('error', (error: Error) => {
    console.error(`Error: ${error.message}`);
  });
};
