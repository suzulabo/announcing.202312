import { PUBLIC_READER_SENTRY_DSN } from '$env/static/public';
import { handleErrorWithSentry, init as sentryInit } from '@sentry/sveltekit';
import type { HandleClientError } from '@sveltejs/kit';

type SWMessageData =
  | {
      type: 'log';
      args: unknown[];
    }
  | {
      type: 'openChannel';
      channelID: string;
    };

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (event) => {
    const data = event.data as SWMessageData;
    switch (data.type) {
      case 'log':
        console.log('SW:', ...data.args);
        break;
      case 'openChannel': {
        const url = `${location.origin}/${data.channelID}`;
        location.href = url;
        break;
      }
    }
  });
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
