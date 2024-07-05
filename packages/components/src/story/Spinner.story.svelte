<script lang="ts">
  import type { Hst } from '@histoire/plugin-svelte';

  import Spinner from '$lib/Spinner.svelte';

  // eslint-disable-next-line no-import-assign
  export let Hst: Hst;
</script>

<Hst.Story title="Spinner">
  <Spinner />
</Hst.Story>
