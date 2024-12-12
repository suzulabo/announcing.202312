import { type ProcessMessageTask } from '@announcing/notification/tasks/trigger.dev';
import { tasks } from '@trigger.dev/sdk/v3';

type Params = {
  channel: {
    channelID: string;
    name: string;
    icon?: string | undefined;
  };
};

export const triggerProcessMessage = async ({ channel }: Params) => {
  const message: Parameters<ProcessMessageTask['trigger']>[0]['message'] = {
    webpush: {
      headers: {
        TTL: '3600',
      },
      notification: {
        title: `# ${channel.name} : New Announcement`,
        ...(channel.icon && { icon: `/s/${channel.icon}` }),
        data: { channelID: channel.channelID, name: channel.name },
      },
      fcmOptions: {
        link: `/${channel.channelID}`,
      },
    },
  };

  const result = await tasks.trigger<ProcessMessageTask>('process-message', {
    tag: channel.channelID,
    message,
  });

  console.log('triggerProcessMessage', result);
};
