import { configDotenv } from 'dotenv';
import { writeFile } from 'node:fs/promises';
import type { Unstable_RawConfig } from 'wrangler';

configDotenv({ path: '.wrangler.env.remote' });

const { PROJECT_NAME, D1_NOTIFICATION_ID } = process.env;

const d1Notification = {
  binding: 'D1_NOTIFICATION',
  database_name: 'D1_NOTIFICATION',
  database_id: 'D1_NOTIFICATION_LOCAL',
  migrations_dir: './migrations',
};

const workflows = [
  {
    name: 'ProcessMessage',
    binding: 'WF_PROCESS_MESSAGE',
    class_name: 'ProcessMessageWorkflowEntrypoint',
  },
  {
    name: 'SendMessage',
    binding: 'WF_SEND_MESSAGE',
    class_name: 'SendMessageWorkflowEntrypoint',
  },
];

const config: Unstable_RawConfig = {
  ...(PROJECT_NAME && { name: PROJECT_NAME }),
  main: '.svelte-kit/cloudflare/_worker.js',
  compatibility_date: '2025-05-05',
  compatibility_flags: ['nodejs_compat_v2'],
  upload_source_maps: true,

  env: {
    local: {
      d1_databases: [d1Notification],
      workflows,
    },
    remote: {
      d1_databases: [
        { ...d1Notification, database_id: D1_NOTIFICATION_ID ?? 'D1_NOTIFICATION_REMOTE' },
      ],
      workflows,
    },
  },
};

await writeFile('wrangler.jsonc', JSON.stringify(config, undefined, 2));
