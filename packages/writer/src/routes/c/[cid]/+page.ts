import type { PageLoad } from './$types';

export const ssr = false;

export const load: PageLoad = ({ data, params }) => {
  return { ...data, cid: params.cid };
};
