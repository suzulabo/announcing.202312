import { dev } from '$app/environment';
import { error } from '@sveltejs/kit';
import { isValid } from 'psl';
import { Fetcher } from '../../lib/fetcher';
import type { PageLoad } from './$types';

const isValidDomain = (s: string) => {
  if (dev) {
    if (s.endsWith('.mock')) {
      return true;
    }
  }
  return isValid(s);
};

const normURL = (s: string) => {
  try {
    const url = new URL(`https://${s}`);
    if (!isValidDomain(url.hostname)) {
      throw error(404);
    }
    return url.toString();
  } catch (e) {
    throw error(404);
  }
};

export const load: PageLoad = async ({ params, fetch }) => {
  const url = normURL(params.url);
  const res = await new Fetcher(fetch).get(url);
  console.log(res.body);
};
