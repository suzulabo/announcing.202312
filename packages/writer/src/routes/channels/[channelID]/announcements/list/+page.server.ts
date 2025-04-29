import { db } from '$lib/db/db';
import { resolveChannel } from '$lib/db/resolver';
import { getUserID } from '$lib/utils/getUserID';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
  const userID = await getUserID(locals);

  const channel = await db.getChannel({ userID, channelID: params.channelID }, locals.cf);

  if (!channel) {
    redirect(303, '/');
  }

  return {
    channel: resolveChannel(channel),
  };
};
