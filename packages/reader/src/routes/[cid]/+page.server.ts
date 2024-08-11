import { getChannel } from '@announcing/db';
import { READER } from '@announcing/db/dist/api/channel/getChannel';
import { error } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const { cid } = params;

  const channel = await getChannel(READER, cid);

  console.log({ channel });

  if (!channel) {
    error(404);
  }

  return { channel };
};
