import { defineConfig } from '@trigger.dev/sdk/v3';
import { configDotenv } from 'dotenv';

configDotenv({ path: '.env.local' });

const project = process.env['TRIGGER_DEV_PROJECT_REF'];
if (!project) {
  throw new Error('TRIGGER_DEV_PROJECT_REF is not set.');
}

const dirs = ['./src/tasks/trigger.dev'];
if (process.env['INCLUDE_DEV']) {
  dirs.push('./src/tasks/trigger.dev.dev');
}

export default defineConfig({
  project,
  runtime: 'node',
  logLevel: 'log',
  // Set the maxDuration to 300 seconds for all tasks. See https://trigger.dev/docs/runs/max-duration
  // maxDuration: 300,
  retries: {
    enabledInDev: true,
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
      randomize: true,
    },
  },
  dirs,
  build: {
    // https://github.com/tursodatabase/libsql-js/issues/70#issuecomment-1854372068
    external: ['libsql'],
  },
});
