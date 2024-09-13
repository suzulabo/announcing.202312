import { getChannels } from '@announcing/db';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.auth();

  const userID = session?.user?.id;

  const channels = userID ? await getChannels(userID) : [];

  return { channels };
};
