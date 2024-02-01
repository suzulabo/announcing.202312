import { AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET, AUTH_SECRET } from '$env/static/private';
import { SvelteKitAuth } from '@auth/sveltekit';
import Google from '@auth/sveltekit/providers/google';

export const handle = SvelteKitAuth(async () => {
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
