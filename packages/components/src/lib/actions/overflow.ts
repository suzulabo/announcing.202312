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

export const overflow: Action = (el) => {
  let observer: ResizeObserver | undefined;
  const unsubscribe = resizeObserver.subscribe((v) => {
    observer = v;
    observer.observe(el);
  });

  return {
    destroy: () => {
      observer?.unobserve(el);
      unsubscribe();
    },
  };
};
