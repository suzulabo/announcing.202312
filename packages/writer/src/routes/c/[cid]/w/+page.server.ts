import { createChannel } from '$lib/db/handlers/createChannel.js';
import { getChannel } from '$lib/db/handlers/getChannel.js';
import { updateChannel } from '$lib/db/handlers/updateChannel.js';
import { fail, redirect } from '@sveltejs/kit';
import crypto from 'crypto';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types.js';
import { formSchema } from './formSchema.js';

export const load: PageServerLoad = async ({ parent, params }) => {
  if (params.cid === 'new') {
    return { form: await superValidate(valibot(formSchema)) };
  }

  const userID = (await parent()).session?.user?.id;

  const channel = await getChannel(userID, params.cid);

  if (!channel) {
    throw redirect(303, '/');
  }

  const { title, desc, icon, updatedAt } = channel;

  return {
    form: await superValidate({ title, desc, updatedAt: updatedAt.getTime() }, valibot(formSchema)),
    icon,
  };
};

const invalidChannelIDPattern = /(.)\1\1/;

const genChannelID = () => {
  for (;;) {
    const id = crypto.randomInt(100000, 999999).toString();

    if (!invalidChannelIDPattern.test(id)) {
      return id;
    }
  }
};

export const actions = {
  default: async ({ request, locals, params }) => {
    const form = await superValidate(request, valibot(formSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const { title, desc, icon, updatedAt } = form.data;

    const session = await locals.auth();

    const userID = session?.user?.id;

    if (!userID) {
      return fail(400, { form });
    }

    if (params.cid === 'new') {
      const channelID = genChannelID();

      await createChannel(userID, channelID, title, desc, icon);
      redirect(303, '/');

      return;
    }

    await updateChannel(userID, new Date(updatedAt || 0), params.cid, title, desc, icon);
    redirect(303, `/c/${params.cid}`);
  },
};
