import { addAnnouncement } from '@announcing/db';
import { error, json } from '@sveltejs/kit';

import { getFormFile, getFormFiles, getFormString } from '$lib/utils/form';
import { getUserIDNoRedirect } from '$lib/utils/getUserID';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, params, request }) => {
  const userID = await getUserIDNoRedirect(locals);
  if (!userID) {
    error(400, 'Missing userID');
  }

  const formData = await request.formData();

  const body = getFormString(formData, 'body');
  if (!body) {
    error(400, 'Missing body');
  }
  const title = getFormString(formData, 'title');
  const headerImageFile = getFormFile(formData, 'headerImage');
  const imagesFiles = getFormFiles(formData, 'images');

  const channelID = params.channelID;

  await addAnnouncement({
    userID,
    channelID,
    headerImageFile,
    title,
    body,
    imagesFiles,
    createdAt: new Date().getTime(),
  });

  return json({});
};
