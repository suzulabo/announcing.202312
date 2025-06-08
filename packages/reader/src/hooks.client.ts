import { PUBLIC_READER_SENTRY_DSN } from '$env/static/public';
import { handleErrorWithSentry, init as sentryInit } from '@sentry/sveltekit';
import type { HandleClientError } from '@sveltejs/kit';

type SWMessageData =
  | {
      type: 'log';
      args: unknown[];
    }
  | {
      type: 'open';
      url: string;
    };

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (event) => {
    const data = event.data as SWMessageData;
    switch (data.type) {
      case 'log':
        console.log('SW:', ...data.args);
        break;
      case 'open': {
        console.log('SW open: ', data.url);
        location.href = data.url;
        break;
      }
    }
  });

  const sw = await navigator.serviceWorker.ready;
  console.debug('sw.active', !!sw.active);
  sw.active?.postMessage('hello');
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
