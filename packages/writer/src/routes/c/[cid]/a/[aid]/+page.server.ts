import { addAnnouncement, updateAnnouncement } from '$lib/db/handlers/announcement';
import { getChannel } from '$lib/db/handlers/getChannel';
import { getUserID } from '$lib/utils/getUserID';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import { formSchema } from './formSchema';

export const load: PageServerLoad = async ({ params, locals }) => {
  const userID = await getUserID(locals);

  const channel = await getChannel(userID, params.cid);

  if (!channel) {
    throw redirect(303, '/');
  }

  const aid = params.aid;

  if (aid === 'new') {
    return {
      form: await superValidate({ updatedAt: channel.updatedAt.getTime() }, valibot(formSchema)),
    };
  }

  const announcement = channel.announcements?.find((v) => v.id === aid);

  if (!announcement) {
    throw redirect(303, `/c/${params.cid}`);
  }

  const { title, body, headerImage, images } = announcement;

  return {
    form: await superValidate(
      { title: title ?? '', body: body ?? '', updatedAt: channel.updatedAt.getTime() },
      valibot(formSchema),
    ),
    headerImage,
    images,
  };
};

export const actions = {
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

      throw redirect(303, `/c/${cid}`);
    } else {
      await updateAnnouncement(userID, cid, updatedAt, headerImage, title, body, images, aid);
    }
  },
  remove: async ({ params }) => {
    console.log('remove action');

    throw redirect(303, `/c/${params.cid}`);
  },
};
