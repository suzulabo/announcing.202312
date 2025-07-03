<script lang="ts">
  import { LL } from '@announcing/i18n';
  import { scale } from 'svelte/transition';
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
  let channels = $derived(data.channels);
  let channelsSaved: typeof channels;
  let editing = $state(false);
</script>

<div class="header">
  <div class="title">{$LL.favoritesList()}</div>
  {#if editing}
    <button
      class="small"
      in:scale
      onclick={() => {
        editing = false;
      }}>{$LL.update()}</button
    >
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
        channelsSaved = [...channels];
        editing = true;
      }}>{$LL.edit()}</button
    >
  {/if}
</div>

{#if editing}
  <div class="desc">
    {$LL.editFavoritesDesc()}
  </div>
{/if}

<div class="channels">
  {#each channels as channel (channel.channelID)}
    {#if editing}
      <label class="channel card">
        <input type="checkbox" in:scale />
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
