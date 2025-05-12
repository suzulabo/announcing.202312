import type { BaseMessage } from 'firebase-admin/messaging';

export type ProcessMessageParams = {
  tag: string;
  message: BaseMessage;
};

export type SendMessageParams = {
  tokens: string[];
  message: BaseMessage;
};

export type ProcessMessageWorkflow = Workflow<ProcessMessageParams>;
export type SendMessageWorkflow = Workflow<SendMessageParams>;

export type WorkerEnv = {
  D1_NOTIFICATION: D1Database;
  WF_PROCESS_MESSAGE: ProcessMessageWorkflow;
  WF_SEND_MESSAGE: SendMessageWorkflow;
  GOOGLE_CREDENTIALS_BASE64: string;
};
