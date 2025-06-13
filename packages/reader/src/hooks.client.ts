import { PUBLIC_READER_SENTRY_DSN } from '$env/static/public';
import { postLog } from '$lib/fetch/postLog';
import { handleErrorWithSentry, init as sentryInit } from '@sentry/sveltekit';
import type { HandleClientError } from '@sveltejs/kit';

void postLog('hooks.client');

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', async (event) => {
    await postLog({ 'message event': event.data });
    const data = event.data;
    if (data.type === 'openChannel') {
      const channelID = data.channelID;
      await postLog({ openChannel: channelID });
      const link = `x-safari-https://${location.host}/${channelID}`;
      location.href = link;
    }
  });

  void (async () => {
    const sw = await navigator.serviceWorker.ready;
    await postLog({ 'sw ready': !!sw.active });
    sw.active?.postMessage({ type: 'ready' });
  })();
} else {
  void postLog('no service worker');
}

if (PUBLIC_READER_SENTRY_DSN) {
  sentryInit({
    dsn: PUBLIC_READER_SENTRY_DSN,
    tracesSampleRate: 1.0,
  });
}

const errorHandler: HandleClientError = (input) => {
  console.error('Unhandled error: ', input);
};

export const handleError = handleErrorWithSentry(errorHandler);
