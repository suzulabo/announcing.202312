<script lang="ts">
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let channels = $derived(data.channels);
</script>

{#if channels.length === 0}
  no notification
{/if}
