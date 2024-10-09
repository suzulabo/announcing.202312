import { afterNavigate } from '$app/navigation';

export const setupBack = () => {
  let fromHref: string | undefined;

  afterNavigate((params) => {
    if (params.from) {
      fromHref = params.from.url.href;
    }
  });

  return (el: HTMLAnchorElement) => {
    const clickHandler = (event: MouseEvent) => {
      if (fromHref && fromHref === el.href) {
        event.preventDefault();
        history.back();
      }
    };

    el.addEventListener('click', clickHandler);

    return {
      destroy: () => {
        el.removeEventListener('click', clickHandler);
      },
    };
  };
};
