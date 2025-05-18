import type { ProcessMessageWorkflowRunEntrypoint } from './worker';

export type { ProcessMessageParams } from './workflows/types';
export type NotificationBindings = {
  WF_PROCESS_MESSAGE_RUN: ProcessMessageWorkflowRunEntrypoint;
};
