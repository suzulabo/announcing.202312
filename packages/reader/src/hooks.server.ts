import { dev } from '$app/environment';
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

export const handle = sequence(cloudflareHandle);
