<script lang="ts" context="module">
  import { setLocale } from '../src/i18n/i18n-svelte';
  import { loadAllLocalesAsync } from '../src/i18n/i18n-util.async';

  await loadAllLocalesAsync();
</script>

<script lang="ts">
  setLocale('en');
</script>

<slot />
