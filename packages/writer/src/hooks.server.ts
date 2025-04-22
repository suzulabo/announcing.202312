import { env } from '$env/dynamic/private';
import { setDBEnv, setStorage } from '@announcing/db';
import { createTriggerClient } from '@announcing/notification/tasks/trigger.dev';
import { type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { handle as authenticationHandle } from './auth';

setDBEnv({ url: env.DB_URL, authToken: env.DB_AUTH_TOKEN });

const { S3_CLIENT_PARAMS, S3_BUCKET, S3_PREFIX } = env;

if (S3_CLIENT_PARAMS && S3_BUCKET) {
  const createS3Storage = (await import('@announcing/db/S3Storage')).createS3Storage;
  setStorage(createS3Storage(S3_CLIENT_PARAMS, S3_BUCKET, S3_PREFIX));
} else {
  const createLocalStorage = (await import('@announcing/db/LocalStorage')).createLocalStorage;
  setStorage(createLocalStorage());
}

const performanceHandle: Handle = async ({ event, resolve }) => {
  const start = performance.now();

  const response = await resolve(event);

  const end = performance.now();
  const duration = end - start;

  console.log(`[PERF] ${event.request.method} ${event.url.pathname} - ${duration.toFixed(2)} ms`);

  return response;
};

const authorizationHandle: Handle = async ({ resolve, event }) => {
  if (!event.url.pathname.startsWith('/signin')) {
    const session = await event.locals.auth();

    if (!session?.user?.id) {
      redirect(303, '/signin');
    }
  }

  return resolve(event);
};

const triggerClientHandle: Handle = ({ resolve, event }) => {
  event.locals.triggerClient = createTriggerClient(env.TRIGGER_SECRET_KEY);
  return resolve(event);
};

export const handle = sequence(
  ...(env.PERFORMANCE_HOOK ? [performanceHandle] : []),
  authenticationHandle,
  authorizationHandle,
  triggerClientHandle,
);
