import { AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET, AUTH_SECRET } from '$env/static/private';
import { base62 } from '$lib/utils/base62';
import { SvelteKitAuth } from '@auth/sveltekit';
import Google from '@auth/sveltekit/providers/google';
import { createHash } from 'crypto';

export const { handle, signIn, signOut } = SvelteKitAuth({
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
  callbacks: {
    jwt: async ({ token, account }) => {
      if (account) {
        const digest = createHash('sha256')
          .update(`${account.provider}:${account.providerAccountId}`)
          .digest();

        token.userID = base62.encode(digest);
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (session.user && token.userID) {
        session.user.id = token.userID as string;
      }

      return session;
    },
  },
  secret: AUTH_SECRET,
});
