import { base62 } from '@announcing/db';
import { SvelteKitAuth, type SvelteKitAuthConfig } from '@auth/sveltekit';
import Credentials from '@auth/sveltekit/providers/credentials';
import Google from '@auth/sveltekit/providers/google';
import { createHash } from 'crypto';

import { env } from '$env/dynamic/public';
import { AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET, AUTH_SECRET } from '$env/static/private';

const providers: SvelteKitAuthConfig['providers'] = [
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
];

if (env.PUBLIC_TEST) {
  providers.push(
    Credentials({
      credentials: {
        id: {},
      },
      authorize: (credentials) => {
        return { id: credentials.id as string };
      },
    }),
  );
}

export const { handle, signIn, signOut } = SvelteKitAuth({
  providers,
  callbacks: {
    jwt: ({ token, account }) => {
      console.log('callback', { token, account });

      if (account) {
        const digest = createHash('sha256')
          .update(`${account.provider}:${account.providerAccountId}`)
          .digest();

        token['userID'] = base62.encode(digest);

        console.log('userID', token['userID']);
      }

      return token;
    },
    session: ({ session, token }) => {
      console.log('session', { session, token });
      if (token['userID']) {
        session.user.id = token['userID'] as string;
      }

      console.log('session.user.id', session.user.id);

      return session;
    },
  },
  secret: AUTH_SECRET,
});
