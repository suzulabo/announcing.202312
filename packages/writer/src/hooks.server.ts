import { setDBEnv } from '@announcing/db/utils';
import { type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

import { handle as authenticationHandle } from './auth';

setDBEnv({ imagePrefix: '/s/' });

const authorizationHandle: Handle = async (input) => {
  const event = input.event;

  if (!event.url.pathname.startsWith('/signin')) {
    const session = await event.locals.auth();

    if (!session?.user?.id) {
      redirect(303, '/signin');
    }
  }

  return input.resolve(event);
};

export const handle = sequence(authenticationHandle, authorizationHandle);
