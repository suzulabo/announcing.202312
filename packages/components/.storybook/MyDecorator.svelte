<script lang="ts" context="module">
  import type { Locales } from '$lib/i18n/i18n-types';

  import { setLocale } from '../src/lib/i18n/i18n-svelte';
  import { loadAllLocalesAsync } from '../src/lib/i18n/i18n-util.async';

  await loadAllLocalesAsync();
</script>

<script lang="ts">
  export let context: { globals: { locale: Locales } };

  $: setLocale(context.globals.locale);
</script>

<slot />
