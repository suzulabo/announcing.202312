import { db } from '$lib/db/client.js';
import { threads } from '$lib/db/schema.js';
import { create as formSchema } from '$lib/form/schema';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';

export const load = async () => {
  const form = await superValidate(valibot(formSchema));
  return { form };
};

export const actions = {
  default: async ({ request }) => {
    const form = await superValidate(request, valibot(formSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const { title, desc } = form.data;

    await db.insert(threads).values({ threadID: 1, title, desc });

    redirect(303, '/');
  },
};
