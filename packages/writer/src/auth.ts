import { SvelteKitAuth, type SvelteKitAuthConfig } from '@auth/sveltekit';
import Credentials from '@auth/sveltekit/providers/credentials';
import Google from '@auth/sveltekit/providers/google';

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
      if (account) {
        token['userID'] = `${account.provider}:${account.providerAccountId}`;
      }

      return token;
    },
    session: ({ session, token }) => {
      if (token['userID']) {
        session.user.id = token['userID'] as string;
      }

      return session;
    },
  },
  secret: AUTH_SECRET,
  trustHost: true,
});
