import { AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET, AUTH_SECRET } from '$env/static/private';
import { SvelteKitAuth } from '@auth/sveltekit';
import Google from '@auth/sveltekit/providers/google';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const authorization: Handle = async ({ event, resolve }) => {
  if (!event.url.pathname.startsWith('/signin')) {
    const session = await event.locals.auth();
    if (!session?.user?.id) {
      throw redirect(302, '/signin');
    }
  }

  return resolve(event);
};

export const auth = SvelteKitAuth(async () => {
  return {
    providers: [
      Google({
        clientId: AUTH_GOOGLE_ID,
        clientSecret: AUTH_GOOGLE_SECRET,
        authorization: {
          params: {
            scope: 'openid',
            prompt: 'select_account',
          },
        },
      }),
    ],
    secret: AUTH_SECRET,
    callbacks: {
      session: async ({ session, token }) => {
        if (session.user && token.sub) {
          session.user.id = token.sub;
        }
        return session;
      },
    },
  };
});

export const handle = sequence(auth, authorization);
