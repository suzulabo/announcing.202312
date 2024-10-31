import { afterNavigate, replaceState } from '$app/navigation';
import { page } from '$app/stores';
import { get } from 'svelte/store';

/*
 Save the 'from' href of afterNavigate in page.state for prioritized use.
 For example, consider a navigation sequence of `/1` -> `/2` -> `/3` and then a back navigation `/3` -> `/2` -> `/1`.
 When returning from `/3` to `/2`, it's clear that `/3` came from `/2` based on afterNavigate's parameters.
 However, when navigating back from `/2` to `/1`, afterNavigate's 'from' will be `/3`, losing the information that `/2` was initially reached from `/1`.
 To address this, the state saves the original `/1` -> `/2` transition.
 This allows the code to correctly judge when history.back can be used to navigate back to `/1` from `/2`.
*/
export const setupBack = () => {
  let fromHref: string | undefined;

  afterNavigate((params) => {
    const state = get(page).state;
    if (state.fromHref) {
      fromHref = state.fromHref;
      return;
    }

    if (params.from) {
      replaceState('', { ...state, fromHref: params.from.url.href });
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
