<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

hello

<hr />

{JSON.stringify(data.users)}
