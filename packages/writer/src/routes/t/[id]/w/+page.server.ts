import { createThread } from '$lib/db/routes/create/page.js';
import { getThread } from '$lib/db/routes/t/index.js';
import { fail, redirect } from '@sveltejs/kit';
import crypto from 'crypto';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types.js';
import formSchema from './formSchema.js';

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;

  if (id === 'new') {
    return { form: await superValidate(valibot(formSchema)) };
  }

  const t = await getThread(+id);

  if (!t) {
    throw redirect(303, '/');
  }

  const { title, desc, icon } = t;

  return { form: await superValidate({ title, desc }, valibot(formSchema)), icon };
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
