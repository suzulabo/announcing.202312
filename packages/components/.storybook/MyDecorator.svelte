<script lang="ts" context="module">
  import { setLocale } from '../src/lib/i18n/i18n-svelte';
  import { loadAllLocalesAsync } from '../src/lib/i18n/i18n-util.async';

  await loadAllLocalesAsync();
</script>

<script lang="ts">
  setLocale('en');
</script>

<slot />
