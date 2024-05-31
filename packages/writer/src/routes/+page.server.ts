import { getThreads } from '$lib/db/routes';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.auth();

  const userID = session?.user?.id;

  const threads = await getThreads(userID);

  return { threads };
};
