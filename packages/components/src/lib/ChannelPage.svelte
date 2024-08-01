<svelte:options customElement={{ tag: 'channel-page' }} />

<script lang="ts" context="module">
  // Re-export
  export type { ChannelPageParams } from './ChannelPage';
</script>

<script lang="ts">
  import { type ChannelPageParams, setup } from './ChannelPage';
  import { loadChannelViewComponents } from './ChannelView/loader';
  import Loading from './Loading.svelte';

  export let params: ChannelPageParams;

  $: ({ loading, announcements, channelViewParams, bottomIntersectionAction } = setup(params));
</script>

{#await loadChannelViewComponents()}
  <Loading show={true} />
{:then { ChannelView, AnnouncementView }}
  <ChannelView params={channelViewParams}>
    <div class="announcement">
      {#each $announcements as announcement (announcement.id)}
        <AnnouncementView params={{ announcement }} />
      {/each}
      <div use:bottomIntersectionAction></div>
    </div>
  </ChannelView>
  <Loading show={$loading} />
{/await}

<style lang="scss">
  .announcement {
    content-visibility: auto;
  }
</style>
