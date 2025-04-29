import { getUserID } from '$lib/utils/getUserID';

import { db } from '$lib/db/db';
import { resolveChannel } from '$lib/db/resolver';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const userID = await getUserID(locals);

  const channels = (await db.getChannels({ userID }, locals.cf)).map((v) => {
    return resolveChannel(v);
  });

  return { channels };
};
