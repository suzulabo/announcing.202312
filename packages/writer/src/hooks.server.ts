import { type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

import { CF } from '$env/static/private';
import { setDBEnv } from '@announcing/db';
import { handle as authenticationHandle } from './auth';

const localDB = await (async () => {
  if (!CF) {
    /*
    Cloudflare Pages does not allow local filesystem APIs.
    Therefore, use dynamic import to exclude this code from the Cloudflare build.
   */
    const { createLocalDB } = await import('@announcing/cloudflare/localDB');
    return createLocalDB();
  }
  return undefined;
})();

const localDBHandle: Handle = ({ resolve, event }) => {
  const db = event.platform?.env.DB ?? localDB;
  if (db) {
    setDBEnv(db);
  } else {
    throw new Error('D1 is not set');
  }

  return resolve(event);
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

export const handle = sequence(authenticationHandle, authorizationHandle, localDBHandle);
