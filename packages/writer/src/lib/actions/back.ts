import { afterNavigate, replaceState } from '$app/navigation';
import type { Action } from 'svelte/action';

export const setupBack = (fromPage: string | undefined) => {
  if (!fromPage) {
    afterNavigate(({ from, to }) => {
      if (from?.url && to) {
        replaceState(to.url, { fromPage: from.url.href });
        fromPage = from.url.href;
      }
    });
  }

  const back: Action<HTMLAnchorElement | undefined> = (a) => {
    if (!a) return;

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
