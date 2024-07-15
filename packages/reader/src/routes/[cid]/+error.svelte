<script lang="ts">
  import { page } from '$app/stores';

  $: status = $page.status;
</script>

{#if status === 404}
  チャンネルが存在しません
{/if}

{#if status !== 404}
  チャンネルの読込中にエラーが発生しました
{/if}
