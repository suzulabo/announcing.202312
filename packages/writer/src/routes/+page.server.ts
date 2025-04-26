import { getUserID } from '$lib/utils/getUserID';

import { db } from '$lib/db/db';
import { resolveChannel } from '$lib/db/resolver';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, platform }) => {
  const userID = await getUserID(locals);

  const channels = (await db.getChannels({ userID }, platform?.env)).map((v) => {
    return resolveChannel(v);
  });

  return { channels };
};
