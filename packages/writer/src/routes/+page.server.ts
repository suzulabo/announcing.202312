import type { PageServerLoad } from './$types';

export const load = (async ({ platform }) => {
  console.log({ platform });
  const res = await platform?.env.DB.prepare('SELECT * FROM users').all();

  const data = res.results ?? [];

  return {
    users: data,
  };
}) satisfies PageServerLoad;
