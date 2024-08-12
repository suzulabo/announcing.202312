import { deleteChannel, getChannel } from '@announcing/db';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';

import { getUserID } from '$lib/utils/getUserID.js';

import type { Actions, PageServerLoad } from './$types.js';
import { formSchema } from './formSchema.js';

export const load: PageServerLoad = async ({ locals, params }) => {
  if (params.channelID === 'new') {
    return { form: await superValidate(valibot(formSchema)) };
  }

  const userID = await getUserID(locals);

  const channel = await getChannel(userID, params.channelID);

  if (!channel) {
    redirect(303, '/');
  }

  const { updatedAt } = channel;

  return {
    form: await superValidate({ updatedAt: updatedAt.getTime() }, valibot(formSchema)),
  };
};

export const actions: Actions = {
  default: async ({ request, locals, params: { channelID } }) => {
    const form = await superValidate(request, valibot(formSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const { updatedAt } = form.data;

    const session = await locals.auth();

    const userID = session?.user?.id;

    if (!userID) {
      return fail(400, { form });
    }

    await deleteChannel(userID, channelID, new Date(updatedAt));
    redirect(303, `/`);
  },
};
