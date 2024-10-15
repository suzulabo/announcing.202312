import { getChannel, READER } from '@announcing/db';
import { error } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const { cid } = params;

  const channel = await getChannel({ userID: READER, channelID: cid });

  console.log({ channel });

  if (!channel) {
    error(404);
  }

  return { channel };
};
