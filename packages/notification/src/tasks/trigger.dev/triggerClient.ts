import { configure, tasks } from '@trigger.dev/sdk/v3';
import type { BaseMessage } from 'firebase-admin/messaging';
import type { processMessageTask } from './processMessageTask';

export type TriggerProcessMessageParams = {
  tag: string;
  message: BaseMessage;
};

export const triggerProcessMessage = async (params: TriggerProcessMessageParams) => {
  await tasks.trigger<typeof processMessageTask>('process-message', params);
};

export const createTriggerClient = (accessToken: string) => {
  configure({
    accessToken,
  });

  return {
    triggerProcessMessage,
  };
};
