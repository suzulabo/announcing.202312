import { getChannel } from '$lib/db/routes/c';
import { createChannel, updateChannel } from '$lib/db/routes/c/w';
import { fail, redirect } from '@sveltejs/kit';
import crypto from 'crypto';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types.js';
import formSchema from './formSchema.js';

export const load: PageServerLoad = async ({ params }) => {
  const cid = params.cid;

  if (cid === 'new') {
    return { form: await superValidate(valibot(formSchema)) };
  }

  const t = await getChannel(+cid);

  if (!t) {
    throw redirect(303, '/');
  }

  const { title, desc, icon, updatedAt } = t;

  return {
    form: await superValidate({ title, desc, updatedAt: updatedAt.getTime() }, valibot(formSchema)),
    icon,
  };
};

const invalidChannelIDPattern = /(.)\1\1/;

const genChannelID = () => {
  for (;;) {
    const id = crypto.randomInt(100000, 999999);

    if (!invalidChannelIDPattern.test(id.toString())) {
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

    await updateChannel(userID, new Date(updatedAt || 0), +params.cid, title, desc, icon);
    redirect(303, `/c/${params.cid}`);
  },
};