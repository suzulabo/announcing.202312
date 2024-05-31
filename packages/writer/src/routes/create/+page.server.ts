import { createThread } from '$lib/db/routes/create/page.js';
import { create as formSchema } from '$lib/form/schema';
import { fail, redirect } from '@sveltejs/kit';
import crypto from 'crypto';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';

export const load = async () => {
  const form = await superValidate(valibot(formSchema));

  return { form };
};

const invalidThreadIDPattern = /(.)\1\1/;

const genThreadID = () => {
  for (;;) {
    const id = crypto.randomInt(100000, 999999);

    if (!invalidThreadIDPattern.test(id.toString())) {
      return id;
    }
  }
};

export const actions = {
  default: async ({ request, locals }) => {
    const form = await superValidate(request, valibot(formSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const { title, desc, icon } = form.data;

    const session = await locals.auth();

    const userID = session?.user?.id;

    if (!userID) {
      return fail(400, { form });
    }

    const threadID = genThreadID();

    await createThread(userID, threadID, title, desc, icon);
    redirect(303, '/');
  },
};
