import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { handle as authenticationHandle } from './auth';

const authorizationHandle: Handle = async ({ event, resolve }) => {
  console.log('aaa');
  if (!event.url.pathname.startsWith('/signin')) {
    const session = await event.locals.auth();
    console.log({ session });
    if (!session?.user?.id) {
      throw redirect(303, '/signin');
    }
  }

  return resolve(event);
};

export const handle = sequence(authenticationHandle, authorizationHandle);
