import { configure, tasks } from '@trigger.dev/sdk/v3';
import type { BaseMessage } from 'firebase-admin/messaging';
import type { processMessageTask } from './processMessageTask';

type Params = {
  channel: {
    channelID: string;
    name: string;
    icon?: string | undefined;
  };
};

export const triggerProcessMessage = async ({ channel }: Params) => {
  const message: BaseMessage = {
    webpush: {
      headers: {
        TTL: '3600',
      },
      data: {
        channelID: channel.channelID,
        name: channel.name,
        ...(channel.icon && { icon: channel.icon }),
      },
    },
  };

  await tasks.trigger<typeof processMessageTask>('process-message', {
    tag: channel.channelID,
    message,
  });
};

export const createTriggerClient = (accessToken: string) => {
  configure({
    accessToken,
  });

  return {
    triggerProcessMessage,
  };
};
