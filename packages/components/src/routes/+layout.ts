import '$lib/base.scss';

import { setLocale } from '$lib/i18n/i18n-svelte';
import { loadAllLocales } from '$lib/i18n/i18n-util.sync';

loadAllLocales();
setLocale('ja');
