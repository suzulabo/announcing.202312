<script lang="ts">
  import type { Hst } from '@histoire/plugin-svelte';

  import Loading from '$lib/Loading.svelte';

  // eslint-disable-next-line no-import-assign
  export let Hst: Hst;

  let show = false;
</script>

<Hst.Story title="Loading">
  <div style="padding: 20px">
    <button on:click={() => (show = true)}>Show</button>
    <Loading bind:show />
  </div>
</Hst.Story>
