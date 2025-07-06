<script lang="ts">
  import { updateFavorites } from '$lib/favorites/favorites';
  import { postNotification } from '$lib/fetch/postNotification';
  import { getNotificationToken } from '$lib/notification/firebase';
  import { isIOS } from '$lib/platform/platform';
  import Loading from '@announcing/components/Loading.svelte';
  import { LL } from '@announcing/i18n';
  import { fade, scale } from 'svelte/transition';
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
  let channels = $derived(data.channels);
  let channelsSaved: typeof channels;
  let editing = $state(false);
  let loading = $state(false);
  let notificationDenied = $state(false);

  const updateClickHandler = async () => {
    notificationDenied = false;
    loading = true;
    try {
      const notificationChannels = channels.filter((v) => v.notification).map((v) => v.channelID);
      const notificationActive = !!channelsSaved.find((v) => v.notification);
      if (notificationActive || notificationChannels.length > 0) {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted' && notificationChannels.length > 0) {
          notificationDenied = true;
          return;
        }

        if (permission === 'granted') {
          const token = await getNotificationToken();
          await postNotification({ token, tags: notificationChannels });
        }
      }
      updateFavorites(channels);
      editing = false;
    } finally {
      loading = false;
    }
  };
</script>

<div class="header">
  <div class="title">{$LL.favoritesList()}</div>
  {#if editing}
    <button class="small" in:scale onclick={updateClickHandler}>{$LL.update()}</button>
    <button
      class="unstyled cancel"
      in:scale
      onclick={() => {
        channels = channelsSaved;
        editing = false;
      }}>{$LL.cancel()}</button
    >
  {:else}
    <button
      class="small"
      in:scale
      onclick={() => {
        channelsSaved = $state.snapshot(channels);
        editing = true;
        notificationDenied = false;
      }}>{$LL.edit()}</button
    >
  {/if}
</div>

{#if editing}
  {#if data.supported}
    <div class="desc" in:fade|global class:error={notificationDenied}>
      {notificationDenied ? $LL.notificationPermissionError() : $LL.editFavoritesDesc()}
    </div>
  {:else if isIOS()}
    <div in:fade|global class="desc ios">
      <!-- TODO: set link -->
      <a class="link" href="https://github.com" rel="noreferrer"
        >{$LL.unsupportedNotificationIOS()}</a
      >
    </div>
  {:else}
    <div in:fade|global class="desc error">
      {$LL.unsupportedNotification()}
    </div>
  {/if}
{/if}

<div class="channels">
  {#if channels.length === 0}
    <div class="no-favorites">{$LL.noFavorites()}</div>
  {/if}

  {#each channels as channel (channel.channelID)}
    {#if editing}
      <label class="channel card">
        {#if data.supported}
          <!-- eslint-disable-next-line svelte/no-unused-svelte-ignore -->
          <!-- svelte-ignore binding_property_non_reactive -->
          <input type="checkbox" in:scale|global bind:checked={channel.notification} />
        {/if}
        <span class="name">{channel.name}</span>
        {#if channel.icon}
          <img src={channel.icon} alt="icon" />
        {/if}
        <button
          class="unstyled error delete"
          in:scale
          onclick={() => {
            channels = channels.filter((v) => {
              return v.channelID !== channel.channelID;
            });
          }}>{$LL.delete()}</button
        >
      </label>
    {:else}
      <a class="channel card" href={`/${channel.channelID}`}>
        <span class="name">{channel.name}</span>
        {#if channel.icon}
          <img src={channel.icon} alt="icon" />
        {/if}
      </a>
    {/if}
  {/each}
</div>

<Loading show={loading} />

<style lang="scss">
  .header {
    color: var(--color-text-subtle);
    margin: 16px 16px 0;
    display: flex;
    align-items: center;
    gap: 8px;

    .title {
      flex-grow: 1;
    }

    .cancel {
      display: inline-block;
      font-weight: normal;
      font-size: 14px;
      color: var(--color-text-subtle);
    }
  }

  .desc {
    padding: 32px 32px 0;
    font-size: 14px;
    margin: 0 auto;
    &:not(.error) {
      color: var(--color-text-subtle);
    }
  }

  .no-favorites {
    margin: 32px auto;
    color: var(--color-text-subtle);
  }

  .channels {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px;

    .channel {
      display: flex;
      align-items: center;
      gap: 8px;

      .name {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        flex: 1;
      }
      img {
        width: 32px;
        height: 32px;
        border-radius: 8px;
      }
      .delete {
        font-size: 13px;
        display: inline-block;
        margin: 0 0 0 8px;
      }
    }
  }
</style>
