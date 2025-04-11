import { browser } from '$app/environment';
import { type Cookies } from '@sveltejs/kit';
import jsCookies from 'js-cookie';

export type Themes = 'light' | 'dark';

export const getTheme = (): Themes => {
  if (!browser) {
    return 'light';
  }

  const theme = jsCookies.get('theme');
  if (theme === 'light' || theme === 'dark') {
    return theme;
  }

  const m = window.matchMedia('(prefers-color-scheme: dark)');
  if (m.matches) {
    return 'dark';
  }

  return 'light';
};

export const setTheme = (theme: Themes) => {
  jsCookies.set('theme', theme);
};

export const initTheme = () => {
  setTheme(getTheme());
};

export const detectRequestTheme = (cookies: Cookies): Themes | undefined => {
  const theme = cookies.get('theme');
  if (theme === 'light' || theme === 'dark') {
    return theme;
  }
  return;
};
