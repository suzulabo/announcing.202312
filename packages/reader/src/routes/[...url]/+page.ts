import { Fetcher } from '../../lib/fetcher';
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

const normURL = (s: string) => {
  try {
    return new URL(`https://${s}`).toString();
  } catch (e) {
    console.error(e);
    throw error(404);
  }
};

export const load: PageLoad = async ({ params, fetch }) => {
  const url = normURL(params.url);
  const res = await new Fetcher(fetch).get(url);
  console.log(res.body);
};
