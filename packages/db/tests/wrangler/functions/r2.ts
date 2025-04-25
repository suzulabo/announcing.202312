import { type EventContext, type R2Bucket } from '@cloudflare/workers-types';
import { createR2Storage } from '../../../src/storage/R2Storage';

interface Env {
  BUCKET: R2Bucket;
}

export const onRequest = async (context: EventContext<Env, string, unknown>) => {
  const storage = createR2Storage(context.env.BUCKET, '/tests');

  const formData = await context.request.formData();

  const image = formData.get('image') as File | null;

  if (!image) {
    return new Response('No image');
  }

  console.log({ image }, typeof image);

  const key = await storage.put(image);

  const obj = await storage.get(key);

  if (!obj) {
    return new Response('Not found', { status: 404 });
  }

  return new Response(new Blob([obj.data], { type: obj.contentType }));
};
