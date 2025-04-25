import { db } from '$lib/db/db';
import { resolveChannel } from '$lib/db/resolver';
import { getChannel, READER } from '@announcing/db';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params }) => {
  const { channelID } = params;

  const channel = await getChannel(db, { userID: READER, channelID });

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
