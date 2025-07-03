<script lang="ts">
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
</script>

{#each data.channels as channel (channel.channelID)}
  <div class="channels">
    <a class="channel card" href={`/${channel.channelID}`}>
      <span class="name">{channel.name}</span>
      {#if channel.icon}
        <img src={channel.icon} alt="icon" />
      {/if}
    </a>
  </div>
{/each}

<style lang="scss">
  .channels {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;

    .channel {
      display: flex;
      align-items: center;
      gap: 8px;
      img {
        width: 32px;
        height: 32px;
        border-radius: 8px;
      }
    }
  }
</style>
