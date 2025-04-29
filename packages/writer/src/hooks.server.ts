import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import { createTriggerClient } from '@announcing/notification/tasks/trigger.dev';
import { type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { handle as authenticationHandle } from './auth';

const performanceHandle: Handle = async ({ event, resolve }) => {
  const start = performance.now();

  const response = await resolve(event);

  const end = performance.now();
  const duration = end - start;

  console.log(`[PERF] ${event.request.method} ${event.url.pathname} - ${duration.toFixed(2)} ms`);

  return response;
};

let localBindings: App.Platform['env'];

if (dev) {
  localBindings = await (await import('@announcing/db/localBindings')).createLocalBindings();
}

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

const cloudflareHandle: Handle = ({ resolve, event }) => {
  if (dev) {
    event.locals.cf = localBindings;
  } else {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    event.locals.cf = event.platform!.env;
  }
  return resolve(event);
};

export const handle = sequence(
  ...(env.PERFORMANCE_HOOK ? [performanceHandle] : []),
  authenticationHandle,
  authorizationHandle,
  triggerClientHandle,
  cloudflareHandle,
);
