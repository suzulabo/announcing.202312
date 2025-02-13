<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

{#if data.ok}
  Notification is ready
{:else}
  Notification is not ready
{/if}
