import { afterNavigate, replaceState } from '$app/navigation';
import type { Action } from 'svelte/action';

const setupBack = (fromPage: string | undefined) => {
  if (!fromPage) {
    afterNavigate(({ from, to }) => {
      if (from && to) {
        replaceState(to.url, { fromPage: from.url.href });
        fromPage = from.url.href;
      }
    });
  }

  const back: Action<HTMLAnchorElement> = (a) => {
    const handler = (event: MouseEvent) => {
      if (a.href === fromPage) {
        event.preventDefault();
        history.back();
      }
    };

    a.addEventListener('click', handler);

    return {
      destroy: () => {
        a.removeEventListener('click', handler);
      },
    };
  };

  return back;
};

export default setupBack;
