import { PUBLIC_ERROR_TEST } from '$env/static/public';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = () => {
  if (!PUBLIC_ERROR_TEST) {
    error(404);
  }
};
