import { deleteChannel } from '@announcing/db';
import { error, json } from '@sveltejs/kit';

import { getUserIDNoRedirect } from '$lib/utils/getUserID';

import type { RequestHandler } from './$types';

type RequestData =
  | {
      updatedAt?: number;
    }
  | undefined;

export const DELETE: RequestHandler = async ({ locals, params, request }) => {
  const userID = await getUserIDNoRedirect(locals);
  if (!userID) {
    error(400, 'Missing userID');
  }

  const data = (await request.json()) as RequestData;
  if (!data || typeof data.updatedAt !== 'number') {
    error(400, 'Invalid request data.');
  }

  const channelID = params.channelID;

  await deleteChannel(userID, channelID, new Date(data.updatedAt));

  return json({});
};
