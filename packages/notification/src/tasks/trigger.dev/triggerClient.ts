import { configure, tasks } from '@trigger.dev/sdk/v3';
import type { BaseMessage, MulticastMessage } from 'firebase-admin/messaging';
import type { processMessageTask } from './processMessageTask';
import type { sendMessageTask } from './sendMessageTask';

export type TriggerProcessMessageParams = {
  tag: string;
  message: BaseMessage;
};

export const triggerProcessMessage = async (params: TriggerProcessMessageParams) => {
  await tasks.trigger<typeof processMessageTask>('process-message', params);
};

export type TriggerSendMessageParams = {
  message: MulticastMessage;
};

export const triggerSendMessage = async (params: TriggerSendMessageParams) => {
  await tasks.trigger<typeof sendMessageTask>('send-message', params);
};

export const createTriggerClient = (accessToken: string) => {
  configure({
    accessToken,
  });

  return {
    triggerProcessMessage,
    triggerSendMessage,
  };
};
