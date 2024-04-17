import './src/lib/base.scss';

// https://github.com/histoire-dev/histoire/issues/339
const isIframe = window.self !== window.top;
document.head
  .querySelectorAll("style[type='text/css']:not([data-vite-dev-id*='histoire'])")
  .forEach((style) => isIframe || style.remove());
