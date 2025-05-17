import { dev } from '$app/environment';
import { PUBLIC_SENTRY_DSN } from '$env/static/public';
import {
  handleErrorWithSentry,
  initCloudflareSentryHandle,
  sentryHandle,
  init as sentryInit,
} from '@sentry/sveltekit';
import { type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

let localBindings: App.Platform['env'];

if (dev) {
  const dbLocal = await (await import('@announcing/db/localBindings')).createLocalBindings();
  const notificationLocal = await (
    await import('@announcing/notification/localBindings')
  ).createLocalBindings(false, '');
  localBindings = { ...dbLocal, ...notificationLocal };
}

const cloudflareHandle: Handle = ({ resolve, event }) => {
  if (dev) {
    event.locals.cf = localBindings;
  } else {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    event.locals.cf = event.platform!.env;
  }
  return resolve(event);
};

const handlers = [];
if (PUBLIC_SENTRY_DSN) {
  if (!dev) {
    handlers.push(
      initCloudflareSentryHandle({
        dsn: PUBLIC_SENTRY_DSN,
        tracesSampleRate: 1.0,
      }),
    );
  } else {
    sentryInit({
      dsn: PUBLIC_SENTRY_DSN,
      tracesSampleRate: 1.0,
    });
  }
  handlers.push(sentryHandle());
}
handlers.push(cloudflareHandle);

export const handle = sequence(...handlers);

export const handleError = handleErrorWithSentry();
