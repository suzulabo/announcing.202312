import { validateAnnouncingJSON, type AnnouncingJSON, type Errors } from '@announcing/json';
import { error } from '@sveltejs/kit';
import { isValid } from 'psl';

import { dev } from '$app/environment';

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
    const urlStr = url.toString();
    if (url.pathname.endsWith('.json')) {
      return urlStr;
    }
    if (urlStr.endsWith('/')) {
      return `${urlStr}announcing.json`;
    } else {
      return `${urlStr}/announcing.json`;
    }
  } catch (e) {
    throw error(404);
  }
};

type LoadResponse = { error: 'RESPONSE' | 'JSON' } | { json: AnnouncingJSON };

export const load: PageLoad = async ({ params, fetch }): Promise<LoadResponse> => {
  const url = normURL(params.url);
  const res = await new Fetcher(fetch).get(url);

  if (!res.ok) {
    return { error: 'RESPONSE' };
  }

  // TODO: checking size
  const json = await res.json();
  const errors: Errors = [];
  const validateResult = validateAnnouncingJSON(json, errors);
  if (!validateResult) {
    console.log({ errors });
    return { error: 'JSON' };
  }

  return {
    json,
  };
};
