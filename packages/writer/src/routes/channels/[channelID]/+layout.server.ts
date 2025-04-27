import { db } from '$lib/db/db';
import { resolveChannel } from '$lib/db/resolver';
import { getUserID } from '$lib/utils/getUserID';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params, locals, platform }) => {
  const userID = await getUserID(locals);

  const channel = await db.getChannel({ userID, channelID: params.channelID }, platform?.env);

  if (!channel) {
    redirect(303, '/');
  }

  return {
    channel: resolveChannel(channel),
  };
};
