import { loadFile } from '@announcing/db';
import { error } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
  const id = params.id;

  const res = await loadFile(id);

  if (!res) {
    return error(404);
  }

  const { contentType, contentLength, content } = res;

  return new Response(content, {
    headers: {
      'Content-Type': contentType,
      'Content-Length': contentLength.toString(),
    },
  });
};
