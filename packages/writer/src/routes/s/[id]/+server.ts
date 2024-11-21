import { error } from '@sveltejs/kit';

import { getStorageData } from '@announcing/db';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
  const id = params.id;

  const res = await getStorageData(id);

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
