import { deleteChannel, updateChannel } from '@announcing/db';
import { error, json } from '@sveltejs/kit';

import { getFormFileOrRemove, getFormNumber, getFormString } from '$lib/utils/form';
import { getUserIDNoRedirect } from '$lib/utils/getUserID';

import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ locals, params, request }) => {
  const userID = await getUserIDNoRedirect(locals);
  if (!userID) {
    error(400, 'Missing userID');
  }

  const formData = await request.formData();

  const name = getFormString(formData, 'name');
  if (!name) {
    error(400, 'Missing name');
  }
  const updatedAt = getFormNumber(formData, 'updatedAt');
  if (!updatedAt) {
    error(400, 'Missing updatedAt');
  }

  const desc = getFormString(formData, 'desc');
  const iconFile = getFormFileOrRemove(formData, 'icon');

  const channelID = params.channelID;

  await updateChannel({ userID, updatedAt, channelID, name, desc, iconFile });

  return json({});
};

type DeleteRequestData =
  | {
      updatedAt?: number;
    }
  | undefined;

export const DELETE: RequestHandler = async ({ locals, params, request }) => {
  const userID = await getUserIDNoRedirect(locals);
  if (!userID) {
    error(400, 'Missing userID');
  }

  const data = (await request.json()) as DeleteRequestData;
  if (!data || typeof data.updatedAt !== 'number') {
    error(400, 'Invalid request data.');
  }

  const channelID = params.channelID;

  await deleteChannel({ userID, channelID, updatedAt: data.updatedAt });

  return json({});
};
