<script lang="ts">
  import { page } from '$app/state';
  import SolarStarBold from '$lib/components/icon/SolarStarBold.svelte';
  import SolarStarLinear from '$lib/components/icon/SolarStarLinear.svelte';
  import { addFavorite, deleteFavorite, getFavorites } from '$lib/favorites/favorites';
  import { fetchAnnouncement } from '$lib/fetch/fetchAnnouncement';
  import { isIOS } from '$lib/platform/platform';
  import ChannelView from '@announcing/components/ChannelView.svelte';
  import ConfirmModal from '@announcing/components/ConfirmModal.svelte';
  import CopyModal from '@announcing/components/CopyModal.svelte';
  import { createSnapshotContext } from '@announcing/components/snapshotContext';
  import { LL } from '@announcing/i18n';
  import { onMount, type ComponentProps } from 'svelte';
  import { fade } from 'svelte/transition';
  import type { PageData } from './$types';
  import Loading from '@announcing/components/Loading.svelte';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let inFavorites = $state(false);
  let loading = $state(false);

  let copyModal: CopyModal;
  let confirmModal: ConfirmModal;

  export const snapshot = createSnapshotContext();

  let channelViewProps = $derived({
    channel: data.channel,
    announcementHrefPrefix: page.url.pathname,
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
    inFavorites = data.channelID in favorites;
  };

  onMount(() => {
    checkFavorites();
  });

  const AddFavoriteCLickHandler = () => {
    addFavorite(data.channel);
    checkFavorites();
  };
  const inFavoriteClickHandler = () => {
    confirmModal.openModal({
      message: $LL.removeFavoriteConfirm(),
      onOK: () => {
        deleteFavorite(data.channelID);
        checkFavorites();
      },
    });
  };
</script>

<svelte:head>
  <title>{data.channel.name}</title>
</svelte:head>

<div class="buttons">
  {#if isIOS()}
    <button
      class="small copy-id"
      onclick={() => {
        copyModal.openModal(data.channelID);
      }}>{$LL.copyID()}</button
    >
  {/if}
  {#if inFavorites}
    <button class="small in-favorites" in:fade onclick={inFavoriteClickHandler}>
      <SolarStarBold />
      <span>{$LL.inFavorites()}</span></button
    >
  {:else}
    <button class="small add-favorites" in:fade onclick={AddFavoriteCLickHandler}>
      <SolarStarLinear />
      <span>{$LL.addFavorites()}</span></button
    >
  {/if}
</div>

<ChannelView {...channelViewProps} />

<CopyModal bind:this={copyModal} />

<ConfirmModal bind:this={confirmModal} />

<Loading show={loading} />

<style lang="scss">
  .buttons {
    display: flex;
    justify-content: end;
    gap: 8px;
    margin: 16px;

    .copy-id {
      font-size: 13px !important;
    }
    .add-favorites,
    .in-favorites {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 13px !important;
    }
  }
</style>
