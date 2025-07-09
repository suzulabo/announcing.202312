<script lang="ts">
  import {
    fetchFavoriteChannels,
    type FavoriteChannel,
  } from '$lib/favorites/fetchFavoriteChannels';
  import { onMount } from 'svelte';

  let channels = $state<FavoriteChannel[]>([]);

  onMount(() => {
    const abort = fetchFavoriteChannels((v) => {
      channels = v;
      console.log({ v });
    });

    return () => {
      abort();
    };
  });
</script>

{#each channels as channel (channel.channelID)}
  <div class="card">
    {channel.name}
    {channel.status}
  </div>
{/each}
