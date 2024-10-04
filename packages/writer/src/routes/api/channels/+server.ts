import { createChannel } from '@announcing/db';
import { error, json } from '@sveltejs/kit';
import crypto from 'crypto';

import { getFormFile, getFormString } from '$lib/utils/form';

import type { RequestHandler } from './$types';

const invalidChannelIDPattern = /(.)\1\1/;

const genChannelID = () => {
  for (;;) {
    const id = crypto.randomInt(10000000, 99999999).toString();

    if (!invalidChannelIDPattern.test(id)) {
      return id;
    }
  }
};

export const POST: RequestHandler = async ({ locals, request }) => {
  const session = await locals.auth();
  const userID = session?.user?.id;
  if (!userID) {
    error(400, 'Missing userID');
  }

  const formData = await request.formData();

  const name = getFormString(formData, 'name');
  if (!name) {
    error(400, 'Missing name');
  }
  const desc = getFormString(formData, 'desc');
  const iconFile = getFormFile(formData, 'icon');

  const channelID = genChannelID();

  await createChannel({ userID, channelID, name, desc, iconFile });

  return json({});
};
