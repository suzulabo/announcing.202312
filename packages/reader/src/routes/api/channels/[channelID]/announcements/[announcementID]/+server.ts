import { error, json } from '@sveltejs/kit';

import { db } from '$lib/db/db';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, locals }) => {
  const { channelID, announcementID } = params;

  const result = await db.getAnnouncement({ channelID, announcementID }, locals.cf);
  if (!result) {
    error(404, 'Missing announcement');
  }

  return json(result);
};
