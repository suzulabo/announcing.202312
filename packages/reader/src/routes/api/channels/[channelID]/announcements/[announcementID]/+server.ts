import { getAnnouncement } from '@announcing/db';
import { error, json } from '@sveltejs/kit';

import { db } from '$lib/db/db';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
  const { channelID, announcementID } = params;

  const result = await getAnnouncement(db, { channelID, announcementID });
  if (!result) {
    error(404, 'Missing announcement');
  }

  return json(result);
};
