import { getChannels } from '@announcing/db';

import { getUserID } from '$lib/utils/getUserID';

import { resolveChannel } from '$lib/db/resolver';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const userID = await getUserID(locals);

  const channels = (await getChannels({ userID })).map((v) => {
    return resolveChannel(v);
  });

  return { channels };
};
