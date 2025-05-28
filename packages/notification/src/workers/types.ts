import type { EnhancedFcmMessage } from 'fcm-cloudflare-workers';

export type ProcessMessageParams = {
  tag: string;
  message: EnhancedFcmMessage;
};

export type SendMessageParams = {
  tokens: string[];
  message: EnhancedFcmMessage;
};

export type PutTokenParams = { token: string; tags: string[] };

export type ProcessMessageWorkflow = Workflow<ProcessMessageParams>;
export type SendMessageWorkflow = Workflow<SendMessageParams>;
