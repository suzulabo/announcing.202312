import { getChannel } from '$lib/db/handlers/getChannel';
import { getUserID } from '$lib/utils/getUserID';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
  const userID = await getUserID(locals);

  const channel = await getChannel(userID, params.cid);

  if (!channel) {
    redirect(303, '/');
  }

  return {
    channel,
  };
};
