import { error, json } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

import { triggerClient } from '$lib/globals/serverGlobals';
import { detectLocale, getI18n } from '@announcing/i18n';
import { createHash, randomInt } from 'node:crypto';

export const GET: RequestHandler = async ({ url, request, cookies }) => {
  const token = url.searchParams.get('token');
  if (!token) {
    error(400);
  }

  const locale = detectLocale({
    cookie: cookies.get('locale'),
    acceptLanguage: request.headers.get('accept-language') ?? undefined,
  });
  const L = getI18n(locale);

  const code = randomInt(1000000).toString().padStart(6, '0');
  const hash = createHash('sha256').update(`${code}:${token}`);

  await triggerClient.triggerSendMessage({
    message: {
      webpush: {
        headers: {
          TTL: '60',
        },
        notification: {
          title: L.verifyNotificationToken.title(),
          body: L.verifyNotificationToken.body(),
          tag: 'verifyNotificationToken',
          data: {
            verifyCode: code,
          },
        },
      },
      tokens: [token],
    },
  });

  return json({ hash }, { headers: { 'Cache-control': 'max-age=30' } });
};
