<script lang="ts">
  import { postNotification } from '$lib/fetch/postNotification';
  import { getNotificationToken } from '$lib/notification/firebase';
  import { saveNotificationChannels } from '$lib/notification/localStorage';
  import Loading from '@announcing/components/Loading.svelte';
  import { onMount } from 'svelte';
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
  let notificationStatus = $derived(data.notificationStatus);

  let loading = $state(false);
  let channels = $derived(notificationStatus.supported ? [...notificationStatus.channels] : []);
  let permission = $state<NotificationPermission>('granted');

  onMount(() => {
    permission = Notification.permission;
  });

  const updateClickHandler = async () => {
    loading = true;
    try {
      permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        return;
      }

      const token = await getNotificationToken();

      const enabledChannels = Object.fromEntries(
        channels
          .filter((v) => {
            return v.status === true;
          })
          .map((v) => {
            return [v.channelID, { name: v.name }];
          }),
      );

      saveNotificationChannels(enabledChannels);

      await postNotification({ token, tags: Object.keys(enabledChannels) });
    } finally {
      loading = false;
    }
  };
</script>

{#if !notificationStatus.supported}
  not supported
{:else}
  {#if channels.length === 0}
    no notification
  {/if}

  <div class="channels">
    {#each channels as channel (channel.channelID)}
      <label class="channel">
        {#if channel.status === 'deleted'}
          <input type="checkbox" disabled /><span class="name">{channel.name}</span><span
            >(deleted)</span
          >
        {:else}
          <!-- eslint-disable-next-line svelte/no-unused-svelte-ignore -->
          <!-- svelte-ignore binding_property_non_reactive -->
          <input type="checkbox" value={channel.channelID} bind:checked={channel.status} />
          <span class="name">{channel.name}</span>
          {#if channel.icon}
            <img src={channel.icon} alt="icon" />
          {/if}
          <a href={`/${channel.channelID}`} class="button small" target="_blank">表示</a>
        {/if}
      </label>
    {/each}
  </div>

  <button class="update-btn" onclick={updateClickHandler}>Update</button>
  {#if permission === 'default'}
    Prompt warning
  {:else if permission === 'denied'}
    Permission error
  {/if}
{/if}

<Loading show={loading} />

<style lang="scss">
  .channels {
    margin: 16px 8px 0;
    display: grid;
    gap: 4px;
    justify-content: center;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));

    .channel {
      border: 1px solid var(--color-border);
      border-radius: 8px;
      padding: 8px;
      min-height: 82px;

      display: flex;
      align-items: center;
      gap: 8px;

      input {
        flex-shrink: 0;
      }

      .name {
        flex-grow: 1;
      }
      img {
        width: 64px;
        height: 64px;
        border-radius: 8px;
        object-fit: contain;
      }
    }
  }

  .update-btn {
    display: block;
    margin: 16px auto;
  }
</style>
