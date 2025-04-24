import { getStorage } from '$lib/db/db';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, platform }) => {
  const id = params.id;

  const storage = await getStorage(platform?.env.bucket);

  const res = await storage.get(id);

  if (!res) {
    return error(404);
  }

  const { contentType, data } = res;

  return new Response(data, {
    headers: {
      'Content-Type': contentType,
      'Content-Length': data.byteLength.toString(),
    },
  });
};
