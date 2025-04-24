import { db } from '$lib/db/db';
import { resolveChannel } from '$lib/db/resolver';
import { getUserID } from '$lib/utils/getUserID';
import { getChannel } from '@announcing/db';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params, locals }) => {
  const userID = await getUserID(locals);

  const channel = await getChannel(db, { userID, channelID: params.channelID });

  if (!channel) {
    redirect(303, '/');
  }

  return {
    channel: resolveChannel(channel),
  };
};
