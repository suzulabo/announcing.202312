<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

{#if data.error}
  {#if data.error === 'RESPONSE'}
    RESPONSE ERROR
  {/if}
  {#if data.error === 'JSON'}
    JSON ERROR
  {/if}
{/if}

{#if data.json}
  <div>{data.json.info.name}</div>
{/if}
