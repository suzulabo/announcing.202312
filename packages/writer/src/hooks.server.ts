import { type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import process from 'node:process';

import { env } from '$env/dynamic/private';
import { CF } from '$env/static/private';
import { setStorage } from '@announcing/db';
import { configure } from '@trigger.dev/sdk/v3';
import { handle as authenticationHandle } from './auth';

process.env['DB_URL'] = env.DB_URL;
process.env['DB_AUTH_TOKEN'] = env.DB_AUTH_TOKEN;

if (!CF) {
  const createLocalStorage = (await import('@announcing/db/LocalStorage')).createLocalStorage;
  setStorage(createLocalStorage());
}

configure({ accessToken: env.TRIGGER_SECRET_KEY });

const timingHandle: Handle = async ({ event, resolve }) => {
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

export const handle = sequence(timingHandle, authenticationHandle, authorizationHandle);
