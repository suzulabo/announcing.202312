import { addAnnouncement, getChannel } from '@announcing/db';
import { error, json } from '@sveltejs/kit';

import { getFormFile, getFormFiles, getFormString } from '$lib/utils/form';
import { getUserIDNoRedirect } from '$lib/utils/getUserID';

import { type TriggerProcessMessageParams } from '@announcing/notification/tasks/trigger.dev';
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
  const headerImage = getFormFile(formData, 'headerImage');
  const images = getFormFiles(formData, 'images');

  const channelID = params.channelID;

  const channel = await getChannel({ userID, channelID });
  if (!channel) {
    error(404, 'Missing channel');
  }

  const announcementValues = await addAnnouncement({
    userID,
    channelID,
    headerImage,
    title,
    body,
    images,
    createdAt: new Date().getTime(),
  });

  if (announcementValues) {
    const triggerParams: TriggerProcessMessageParams = {
      tag: channelID,
      message: {
        webpush: {
          headers: {
            TTL: '3600',
          },
          notification: {
            title: channel.name,
            body: title ?? body,
            tag: channelID,
            ...(channel.icon && { icon: `/s/${channel.icon}` }),
            ...(channel.icon && { badge: `/s/${channel.icon}` }),
            ...(announcementValues.headerImage && {
              image: `/s/${announcementValues.headerImage}`,
            }),
            data: {
              link: `/${channelID}`,
            },
          },
        },
      },
    };

    await locals.triggerClient.triggerProcessMessage(triggerParams);
  }

  return json({});
};
