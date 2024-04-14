<script lang="ts">
  import type { Hst } from '@histoire/plugin-svelte';
  import { logEvent } from 'histoire/client';
  // eslint-disable-next-line no-import-assign
  export let Hst: Hst;
</script>

<Hst.Story title="button">
  <button on:click={(event) => logEvent('click', event)}> Click me!</button>
</Hst.Story>

<style>
</style>
