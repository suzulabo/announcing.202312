import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from '../../$types';
import formSchema from './formSchema';

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;

  if (id === 'new') {
    return {
      form: await superValidate(valibot(formSchema)),
    };
  }

  return {
    form: await superValidate(valibot(formSchema)),
  };
};
