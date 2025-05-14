import { db } from '$lib/db/db';
import { getUserIDNoRedirect } from '$lib/utils/getUserID';
import { error, json } from '@sveltejs/kit';
import * as v from 'valibot';
import type { RequestHandler } from './$types';

const deleteSchema = v.strictObject({
  updatedAt: v.pipe(v.number(), v.integer(), v.minValue(0)),
});

export const DELETE: RequestHandler = async ({ locals, params, request }) => {
  const userID = await getUserIDNoRedirect(locals);
  if (!userID) {
    error(400, 'Missing userID');
  }

  const data = await request.json();
  if (!v.is(deleteSchema, data)) {
    error(400, 'Schema Error');
  }

  const channelID = params.channelID;

  await db.deleteChannel({ userID, channelID, updatedAt: data.updatedAt }, locals.cf);

  return json({});
};
