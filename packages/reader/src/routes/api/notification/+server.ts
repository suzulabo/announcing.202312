import { json } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, request }) => {
  const data = await request.json();

  await locals.tokenStore.putToken(data.token, data.tags);

  return json({});
};
