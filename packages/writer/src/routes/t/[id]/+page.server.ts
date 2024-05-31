import { getThread } from '$lib/db/routes/t';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const thread = await getThread(+params.id);

  if (!thread) {
    throw redirect(303, '/');
  }

  return {
    thread,
  };
};
