<script lang="ts">
  import Spinner from '$lib/Spinner.svelte';
  import type { Hst } from '@histoire/plugin-svelte';

  // eslint-disable-next-line no-import-assign
  export let Hst: Hst;
</script>

<Hst.Story title="Spinner">
  <Spinner />
</Hst.Story>
