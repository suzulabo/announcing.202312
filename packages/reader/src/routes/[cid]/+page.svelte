<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;

  $: channel = data.channel;
</script>

{channel.title}
