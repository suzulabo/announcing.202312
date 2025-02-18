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
      case 'open':
        location.href = data.url;
        break;
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
