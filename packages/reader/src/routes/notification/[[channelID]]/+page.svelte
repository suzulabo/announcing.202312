<script lang="ts">
  import { postNotification } from '$lib/fetch/postNotification';
  import { getNotificationToken } from '$lib/notification/firebase';
  import { saveNotificationChannels } from '$lib/notification/localStorage';
  import Loading from '@announcing/components/Loading.svelte';
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let loading = $state(false);
  let channels = $derived(data.supported ? [...data.channels] : []);

  const updateClickHandler = async () => {
    loading = true;
    try {
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

{#if !data.supported}
  not supported
{:else}
  {#if channels.length === 0}
    no notification
  {/if}

  <ul class="channels">
    {#each channels as channel (channel.channelID)}
      <li>
        {#if channel.status === 'deleted'}
          {channel.name}<span>(deleted)</span>
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
        }
      }
    }
  }
</style>
