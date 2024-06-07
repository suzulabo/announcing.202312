import { addAnnouncement } from '$lib/db/handlers/addAnnouncement';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import formSchema from './formSchema';

export const load: PageServerLoad = async ({ params, parent }) => {
  const aid = params.aid;

  const { channel } = await parent();

  if (aid === 'new') {
    return {
      form: await superValidate({ updatedAt: channel.updatedAt.getTime() }, valibot(formSchema)),
    };
  }

  return {
    form: await superValidate(valibot(formSchema)),
  };
};

export const actions = {
  default: async ({ request, locals, params }) => {
    const form = await superValidate(request, valibot(formSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const { title, body, updatedAt } = form.data;

    const session = await locals.auth();

    const userID = session?.user?.id;

    if (!userID) {
      return fail(400, { form });
    }

    if (params.aid === 'new') {
      await addAnnouncement(userID, +params.cid, updatedAt, body, title);
      redirect(303, `/c/${params.cid}`);

      return;
    }
  },
};
