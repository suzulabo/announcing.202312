import type { ProcessMessageWorkflowRunEntrypoint } from './worker';

export { createDB, type CFBindings as NotificationDBBindings } from './db/db';
export type { ProcessMessageParams } from './workflows/types';

export type NotificationBindings = {
  D1_NOTIFICATION: D1Database;
  WF_PROCESS_MESSAGE_RUN: ProcessMessageWorkflowRunEntrypoint;
};
