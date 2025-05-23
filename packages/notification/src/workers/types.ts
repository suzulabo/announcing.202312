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
