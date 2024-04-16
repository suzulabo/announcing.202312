<script lang="ts">
  import type { Hst } from '@histoire/plugin-svelte';
  import Logo from './Logo.svelte';

  // eslint-disable-next-line no-import-assign
  export let Hst: Hst;
</script>

<Hst.Story title="Logo">
  <Logo size="100px" />
</Hst.Story>
