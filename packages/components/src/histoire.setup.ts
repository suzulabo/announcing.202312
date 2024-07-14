import './lib/base.scss';

document.querySelectorAll<HTMLAnchorElement>('.histoire-toolbar-new-tab').forEach((a) => {
  a.href = a.href + '&newtab';
});

// https://github.com/histoire-dev/histoire/issues/339
const isIframe = window.self !== window.top;

const isNewTab = location.search.includes('&newtab');

console.log({ isIframe, isNewTab });

document.head
  .querySelectorAll("style[type='text/css']:not([data-vite-dev-id*='histoire'])")
  .forEach((style) => {
    if (!isIframe && !isNewTab) {
      style.remove();
    }
  });
