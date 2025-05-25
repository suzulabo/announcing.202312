import { resolveChannel } from '$lib/db/resolver';
import { READER } from '@announcing/db';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params, locals }) => {
  const { channelID } = params;

  const channel = await locals.db.getChannel({ userID: READER, channelID });

  if (!channel) {
    error(404);
  }

  return {
    channel: resolveChannel(channel),
    channelID,
    headerNotification: {
      channelID,
      name: channel.name,
      icon: channel.icon,
    },
  };
};
