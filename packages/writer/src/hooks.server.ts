import { dev } from '$app/environment';
import { GOOGLE_CREDENTIALS_BASE64, PERFORMANCE_HOOK } from '$env/static/private';
import { PUBLIC_SENTRY_DSN } from '$env/static/public';
import * as Sentry from '@sentry/sveltekit';
import { type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { handle as authenticationHandle } from './auth';

if (PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: PUBLIC_SENTRY_DSN,
    tracesSampleRate: 1.0,
  });
}

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
  const dbLocal = await (await import('@announcing/db/localBindings')).createLocalBindings();
  const notificationLocal = await (
    await import('@announcing/notification/localBindings')
  ).createLocalBindings(false, GOOGLE_CREDENTIALS_BASE64);
  localBindings = { ...dbLocal, ...notificationLocal };
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
  ...(PERFORMANCE_HOOK ? [performanceHandle] : []),
  ...(PUBLIC_SENTRY_DSN ? [Sentry.sentryHandle()] : []),
  authenticationHandle,
  authorizationHandle,
  cloudflareHandle,
);

export const handleError = Sentry.handleErrorWithSentry();
