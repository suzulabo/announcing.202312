import { deleteChannel } from '$lib/db/handlers/deleteChannel.js';
import { getChannel } from '$lib/db/handlers/getChannel.js';
import { getUserID } from '$lib/utils/getUserID.js';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types.js';
import { formSchema } from './formSchema.js';

export const load: PageServerLoad = async ({ locals, params }) => {
  if (params.cid === 'new') {
    return { form: await superValidate(valibot(formSchema)) };
  }

  const userID = await getUserID(locals);

  const channel = await getChannel(userID, params.cid);

  if (!channel) {
    redirect(303, '/');
  }

  const { updatedAt } = channel;

  return {
    form: await superValidate({ updatedAt: updatedAt.getTime() }, valibot(formSchema)),
  };
};

export const actions: Actions = {
  default: async ({ request, locals, params: { cid } }) => {
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

    await deleteChannel(userID, cid, new Date(updatedAt));
    redirect(303, `/`);
  },
};
