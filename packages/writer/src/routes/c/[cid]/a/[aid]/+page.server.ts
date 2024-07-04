import {
  addAnnouncement,
  getChannel,
  removeAnnouncement,
  updateAnnouncement,
} from '@announcing/db';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';

import { getUserID } from '$lib/utils/getUserID';

import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './formSchema';

export const load: PageServerLoad = async ({ params, locals }) => {
  const userID = await getUserID(locals);

  const channel = await getChannel(userID, params.cid);

  if (!channel) {
    redirect(303, '/');
  }

  const aid = params.aid;

  if (aid === 'new') {
    return {
      form: await superValidate({ updatedAt: channel.updatedAt.getTime() }, valibot(formSchema)),
    };
  }

  const announcement = channel.announcements?.find(v => v.id === aid);

  if (!announcement) {
    redirect(303, `/c/${params.cid}`);
  }

  const { title, body, headerImage, images } = announcement;

  return {
    form: await superValidate(
      { title: title ?? '', body, updatedAt: channel.updatedAt.getTime() },
      valibot(formSchema),
    ),
    headerImage,
    images,
  };
};

export const actions: Actions = {
  write: async ({ request, locals, params: { cid, aid } }) => {
    const form = await superValidate(request, valibot(formSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const { updatedAt, headerImage, title, body, images } = form.data;

    const session = await locals.auth();

    const userID = session?.user?.id;

    if (!userID) {
      return fail(400, { form });
    }

    if (aid === 'new') {
      await addAnnouncement(userID, cid, updatedAt, headerImage, title, body, images);
      redirect(303, `/c/${cid}`);
    }
    else {
      await updateAnnouncement(userID, cid, updatedAt, headerImage, title, body, images, aid);
    }
  },
  remove: async ({ locals, params: { cid, aid }, request }) => {
    const session = await locals.auth();

    const userID = session?.user?.id;

    if (!userID) {
      return fail(400);
    }

    const updatedAt = (await request.formData()).get('updatedAt');

    if (!updatedAt) {
      return fail(400);
    }

    await removeAnnouncement(userID, cid, +updatedAt, aid);
    redirect(303, `/c/${cid}`);
  },
};
