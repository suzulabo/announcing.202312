import { db } from '$lib/db/db';
import { resolveChannel } from '$lib/db/resolver';
import { READER } from '@announcing/db';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params, locals }) => {
  const { channelID } = params;

  const channel = await db.getChannel({ userID: READER, channelID }, locals.cf);

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
