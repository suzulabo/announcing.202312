import { db, getStorage } from '$lib/db/db';
import {
  getFormFileOrString,
  getFormFilesOrStrings,
  getFormNumber,
  getFormString,
} from '$lib/utils/form';
import { getUserIDNoRedirect } from '$lib/utils/getUserID';
import { getAnnouncement, removeAnnouncement, updateAnnouncement } from '@announcing/db';
import {
  ANNOUNCEMENT_BODY_MAX_BYTES,
  ANNOUNCEMENT_IMAGE_MAX_BYTES,
  ANNOUNCEMENT_TITLE_MAX_BYTES,
  STORAGE_ID_MAX_BYTES,
} from '@announcing/db/constants';
import { error, json } from '@sveltejs/kit';
import * as v from 'valibot';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
  const { channelID, announcementID } = params;

  const result = await getAnnouncement(db, { channelID, announcementID });
  if (!result) {
    error(404, 'Missing announcement');
  }

  return json(result);
};

const putSchema = v.strictObject({
  title: v.union([
    v.pipe(v.string(), v.nonEmpty(), v.maxBytes(ANNOUNCEMENT_TITLE_MAX_BYTES)),
    v.undefined(),
  ]),
  body: v.pipe(v.string(), v.nonEmpty(), v.maxBytes(ANNOUNCEMENT_BODY_MAX_BYTES)),
  headerImage: v.union([
    v.pipe(
      v.blob(),
      v.mimeType(['image/jpeg', 'image/png', 'image/webp']),
      v.maxSize(ANNOUNCEMENT_IMAGE_MAX_BYTES),
    ),
    v.pipe(v.string(), v.nonEmpty(), v.maxBytes(STORAGE_ID_MAX_BYTES)),
    v.undefined(),
  ]),
  images: v.union([
    v.array(
      v.union([
        v.pipe(
          v.blob(),
          v.mimeType(['image/jpeg', 'image/png', 'image/webp']),
          v.maxSize(ANNOUNCEMENT_IMAGE_MAX_BYTES),
        ),
        v.pipe(v.string(), v.nonEmpty(), v.maxBytes(STORAGE_ID_MAX_BYTES)),
      ]),
    ),
    v.undefined(),
  ]),
  targetUpdatedAt: v.pipe(v.number(), v.integer(), v.minValue(0)),
});

export const PUT: RequestHandler = async ({ locals, params, request, platform }) => {
  const userID = await getUserIDNoRedirect(locals);
  if (!userID) {
    error(400, 'Missing userID');
  }

  const formData = await request.formData();

  const data = {
    title: getFormString(formData, 'title'),
    body: getFormString(formData, 'body'),
    headerImage: getFormFileOrString(formData, 'headerImage'),
    images: getFormFilesOrStrings(formData, 'images'),
    targetUpdatedAt: getFormNumber(formData, 'targetUpdatedAt'),
  };

  if (!v.is(putSchema, data)) {
    error(400, 'Schema Error');
  }

  const channelID = params.channelID;
  const targetAnnouncementID = params.announcementID;

  const storage = await getStorage(platform?.env.bucket);

  await updateAnnouncement(db, storage, {
    userID,
    channelID,
    targetAnnouncementID,
    ...data,
  });

  return json({});
};

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

  const { channelID, announcementID } = params;

  await removeAnnouncement(db, {
    userID,
    channelID,
    targetAnnouncementID: announcementID,
    targetUpdatedAt: data.updatedAt,
  });

  return json({});
};
