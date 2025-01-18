import { json } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

import { error } from '@sveltejs/kit';
import * as v from 'valibot';

const postSchema = v.object({
  token: v.pipe(v.string(), v.nonEmpty()),
  tags: v.array(v.pipe(v.string(), v.nonEmpty(), v.maxLength(100))),
});

export const POST: RequestHandler = async ({ locals, request }) => {
  const data = await request.json();

  if (!v.is(postSchema, data)) {
    error(400);
  }

  await locals.tokenStore.putToken(data.token, data.tags);

  return json({});
};
