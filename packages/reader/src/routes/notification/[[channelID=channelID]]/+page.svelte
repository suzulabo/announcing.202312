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

  <ul class="channels">
    {#each channels as channel (channel.channelID)}
      <li>
        {#if channel.status === 'deleted'}
          <label>
            <input type="checkbox" disabled />{channel.name}<span>(deleted)</span>
          </label>
        {:else}
          <label>
            <!-- eslint-disable-next-line svelte/no-unused-svelte-ignore -->
            <!-- svelte-ignore binding_property_non_reactive -->
            <input type="checkbox" value={channel.channelID} bind:checked={channel.status} />
            <span>{channel.name}</span>
            {#if channel.icon}
              <img src={channel.icon} alt="icon" />
            {/if}
          </label>
        {/if}
      </li>
    {/each}
  </ul>

  <div>
    <button onclick={updateClickHandler}>Update</button>
    {#if permission === 'default'}
      Prompt warning
    {:else if permission === 'denied'}
      Permission error
    {/if}
  </div>
{/if}

<Loading show={loading} />

<style lang="scss">
  .channels {
    li {
      label {
        display: flex;
        align-items: center;
        gap: 12px;
        img {
          width: 64px;
          height: 64px;
          border-radius: 8px;
          object-fit: contain;
        }
      }
    }
  }
</style>
