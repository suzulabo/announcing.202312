<script lang="ts">
  import SuperDebug from 'sveltekit-superforms';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<SuperDebug {data} />
