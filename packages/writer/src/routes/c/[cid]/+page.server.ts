import { getChannel } from '$lib/db/handlers/getChannel';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, parent }) => {
  const userID = (await parent()).session?.user?.id;

  const channel = await getChannel(userID, params.cid);

  if (!channel) {
    throw redirect(303, '/');
  }

  return {
    channel,
  };
};
