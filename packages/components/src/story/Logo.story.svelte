<script lang="ts">
  import Logo from '$lib/Logo.svelte';
  import type { Hst } from '@histoire/plugin-svelte';

  // eslint-disable-next-line no-import-assign
  export let Hst: Hst;
</script>

<Hst.Story title="Logo">
  <Logo size="100px" />
</Hst.Story>
