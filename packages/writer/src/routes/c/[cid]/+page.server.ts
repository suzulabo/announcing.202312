import { getChannel } from '$lib/db/routes/c';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const channel = await getChannel(+params.cid);

  if (!channel) {
    throw redirect(303, '/');
  }

  return {
    channel,
  };
};
