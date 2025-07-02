<script lang="ts">
  import ChannelView from '@announcing/components/ChannelView.svelte';

  import { page } from '$app/stores';
  import { fetchAnnouncement } from '$lib/fetch/fetchAnnouncement';

  import SolarStarBold from '$lib/components/icon/SolarStarBold.svelte';
  import SolarStarLinear from '$lib/components/icon/SolarStarLinear.svelte';
  import { addFavorites, getFavorites } from '$lib/favorites/favorites';
  import { createSnapshotContext } from '@announcing/components/snapshotContext';
  import { LL } from '@announcing/i18n';
  import { onMount, type ComponentProps } from 'svelte';
  import { fade } from 'svelte/transition';
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let inFavorites = $state(false);

  export const snapshot = createSnapshotContext();

  let channelViewProps = $derived({
    channel: data.channel,
    announcementHrefPrefix: $page.url.pathname,
    announcementKeys: data.channel.announcementIDs ?? [],
    announcementLoader: (key: string) => {
      return fetchAnnouncement({
        channelID: data.channelID,
        announcementID: key,
      });
    },
  } satisfies ComponentProps<typeof ChannelView>);

  const checkFavorites = () => {
    const favorites = getFavorites();
    console.log({ favorites });
    inFavorites = data.channelID in favorites;
  };

  onMount(() => {
    checkFavorites();
  });
</script>

<svelte:head>
  <title>{data.channel.name}</title>
</svelte:head>

{#if inFavorites}
  <a class="button small in-favorites" href={`/favorites/${data.channelID}`} in:fade
    ><SolarStarBold /><span>{$LL.inFavorites()}</span></a
  >
{:else}
  <button
    class="small add-favorites"
    onclick={() => {
      addFavorites(data.channel);
      checkFavorites();
    }}><SolarStarLinear /><span>{$LL.addFavorites()}</span></button
  >
{/if}

<ChannelView {...channelViewProps} />

<style lang="scss">
  .add-favorites,
  .in-favorites {
    display: flex;
    align-items: center;
    margin-left: auto;
    gap: 4px;
    margin: 16px 16px 16px auto;
  }
  .in-favorites {
    font-size: 13px !important;
  }
</style>
