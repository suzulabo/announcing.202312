import { getChannels } from '$lib/db/handlers/getChannels';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.auth();

  const userID = session?.user?.id;

  const channels = await getChannels(userID);

  return { channels };
};
