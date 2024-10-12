import { getAnnouncement, updateAnnouncement } from '@announcing/db';
import { error, json } from '@sveltejs/kit';

import {
  getFormFileOrString,
  getFormFilesOrStrings,
  getFormNumber,
  getFormString,
} from '$lib/utils/form';
import { getUserIDNoRedirect } from '$lib/utils/getUserID';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
  const { channelID, announcementID } = params;

  const result = await getAnnouncement({ channelID, announcementID });
  if (!result) {
    error(404, 'Missing announcement');
  }

  return json(result);
};

export const PUT: RequestHandler = async ({ locals, params, request }) => {
  const userID = await getUserIDNoRedirect(locals);
  if (!userID) {
    error(400, 'Missing userID');
  }

  const formData = await request.formData();

  const body = getFormString(formData, 'body');
  if (!body) {
    error(400, 'Missing body');
  }
  const targetUpdatedAt = getFormNumber(formData, 'targetUpdatedAt');
  if (!targetUpdatedAt) {
    error(400, 'Missing targetUpdatedAt');
  }

  const title = getFormString(formData, 'title');

  const headerImage = getFormFileOrString(formData, 'headerImage');

  const images = getFormFilesOrStrings(formData, 'images');

  const channelID = params.channelID;
  const targetAnnouncementID = params.announcementID;

  console.log('update?');

  await updateAnnouncement({
    userID,
    channelID,
    targetAnnouncementID,
    targetUpdatedAt,
    headerImage,
    title,
    body,
    images,
  });

  return json({});
};
