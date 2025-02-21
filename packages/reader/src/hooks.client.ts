import { resolveBrowserSchema } from '$lib/platform/resolveBrowserSchema';

type SWMessageData =
  | {
      type: 'log';
      args: unknown[];
    }
  | {
      type: 'open';
      path: string;
    };

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (event) => {
    const data = event.data as SWMessageData;
    switch (data.type) {
      case 'log':
        console.log('SW:', ...data.args);
        break;
      case 'open': {
        const url = `${location.origin}/${data.path}`;
        const urlResolved = resolveBrowserSchema(url);
        location.href = urlResolved;
        break;
      }
    }
  });

  navigator.serviceWorker.ready
    .then((sw) => {
      sw.active?.postMessage('hello');
    })
    .catch(() => {
      //
    });
}
