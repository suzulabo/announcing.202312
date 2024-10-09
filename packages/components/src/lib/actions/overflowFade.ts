import type { Action } from 'svelte/action';
import { readable } from 'svelte/store';

const checkOverflow = (el: Element) => {
  if (el.scrollHeight > el.clientHeight) {
    el.classList.add('overflowing-y');
  } else {
    el.classList.remove('overflowing-y');
  }
  if (el.scrollWidth > el.clientWidth) {
    el.classList.add('overflowing-x');
  } else {
    el.classList.remove('overflowing-x');
  }
};

const observerCallback: ResizeObserverCallback = (entries) => {
  for (const entry of entries) {
    checkOverflow(entry.target);
  }
};

const resizeObserver = readable<ResizeObserver>(undefined, (set) => {
  const observer = new ResizeObserver(observerCallback);
  set(observer);

  return () => {
    observer.disconnect();
  };
});

// When the display size of the target element is fixed with `overflow: hidden`,
// ResizeObserver cannot detect changes in overflow state if the content changes.
// In such cases, pass an arbitrary value that syncs with content changes to create
// a timing to check the overflow state.
export const overflowFade: Action<Element, unknown> = (el) => {
  let observer: ResizeObserver | undefined;
  const unsubscribe = resizeObserver.subscribe((v) => {
    observer = v;
    observer.observe(el);
  });

  return {
    update: () => {
      checkOverflow(el);
    },
    destroy: () => {
      observer?.unobserve(el);
      unsubscribe();
    },
  };
};
