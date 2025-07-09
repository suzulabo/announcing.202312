<script lang="ts">
  import { updateFavorites } from '$lib/favorites/favorites';
  import {
    fetchFavoriteChannels,
    type FavoriteChannel,
  } from '$lib/favorites/fetchFavoriteChannels';
  import { fetchChannel } from '$lib/fetch/fetchChannel';
  import { postNotification } from '$lib/fetch/postNotification';
  import { getNotificationToken } from '$lib/notification/firebase';
  import Loading from '@announcing/components/Loading.svelte';
  import { LL } from '@announcing/i18n';
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  let loading = $state(false);
  let searchChannelID = $state('');
  let channels = $state<FavoriteChannel[]>([]);
  let channelNotFound = $state(false);
  let registered = $state(false);
  let permission = $state<NotificationPermission>('granted');

  onMount(() => {
    const abort = fetchFavoriteChannels((v) => {
      channels = v;
    });

    return () => {
      abort();
    };
  });

  const searchClickHandler = async () => {
    channelNotFound = false;

    if (!searchChannelID) {
      return;
    }
    if (channels.find((v) => v.channelID === searchChannelID)) {
      searchChannelID = '';
      return;
    }
    loading = true;
    try {
      const channel = await fetchChannel(searchChannelID);
      if (!channel) {
        channelNotFound = true;
        return;
      }
      channels = [{ notification: true, channel, ...channel, status: 'LOADED' }, ...channels];
    } finally {
      searchChannelID = '';
      loading = false;
    }
  };

  const updateClickHandler = async () => {
    loading = true;
    try {
      permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        return;
      }

      const token = await getNotificationToken();
      const tags = channels.map((v) => v.channelID);

      await postNotification({ token, tags });
      updateFavorites(channels);
      registered = true;
    } finally {
      loading = false;
    }
  };
</script>

<div class="title">
  {$LL.iosNotification()}
</div>
<div class="input-box">
  <input bind:value={searchChannelID} /><button
    onclick={searchClickHandler}
    disabled={!searchChannelID}>{$LL.search()}</button
  >
</div>
{#if channelNotFound}
  <div
    class="error"
    transition:fade={{ duration: 1000 }}
    onintroend={() => {
      channelNotFound = false;
    }}
  >
    {$LL.channelNotFound()}
  </div>
{/if}

{#each channels as channel (channel.channelID)}
  <div class="card">
    {channel.name}
    {channel.status}
    <button
      class="unstyled error"
      onclick={() => {
        channels = channels.filter((v) => v !== channel);
      }}>{$LL.remove()}</button
    >
  </div>
{/each}

{#if registered}
  <button
    in:fade={{ duration: 2000 }}
    onintroend={() => {
      registered = false;
    }}>{$LL.registered()}</button
  >
{:else}
  <button onclick={updateClickHandler}>{$LL.registerNotification()}</button>
{/if}

<Loading show={loading} />

<style lang="scss">
  .title {
    color: var(--color-text-subtle);
  }
  .input-box {
    margin-top: 8px;
    display: flex;
    width: 100%;
    max-width: 400px;
    input {
      flex-grow: 1;
      text-align: center;
      border-radius: 16px 0 0 16px;
    }
    button {
      border-radius: 0 16px 16px 0;
      padding: 0 16px;
    }
  }
</style>
