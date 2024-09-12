import { setLocale } from './i18n/i18n-svelte';
import { loadAllLocalesAsync } from './i18n/i18n-util.async';

// TODO: Locale management needed
export const setupLocale = async () => {
  await loadAllLocalesAsync();
  setLocale('ja');
};
