import { addAnnouncement } from '$lib/db/handlers/addAnnouncement';
import { getChannel } from '$lib/db/handlers/getChannel';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import { formSchema } from './formSchema';

export const load: PageServerLoad = async ({ params, parent }) => {
  const userID = (await parent()).session?.user?.id;

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
  write: async ({ request, locals, params }) => {
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

    if (params.aid === 'new') {
      await addAnnouncement(userID, params.cid, updatedAt, headerImage, title, body, images);

      throw redirect(303, `/c/${params.cid}`);
    }
  },
  remove: async ({ params }) => {
    console.log('remove action');

    throw redirect(303, `/c/${params.cid}`);
  },
};
