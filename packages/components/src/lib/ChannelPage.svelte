<svelte:options customElement={{ tag: 'channel-page' }} />

<script lang="ts" context="module">
  // Re-export
  export type { ChannelPageParams } from './ChannelPage';
</script>

<script lang="ts">
  import { type ChannelPageParams, setup } from './ChannelPage';
  import Loading from './Loading.svelte';

  export let params: ChannelPageParams;

  $: ({
    loading,
    announcements,
    ChannelView,
    AnnouncementView,
    channelViewParams,
    bottomIntersectionAction,
  } = setup(params));
</script>

<ChannelView params={channelViewParams}>
  <div class="announcement">
    {#each $announcements as announcement (announcement.id)}
      <AnnouncementView params={{ announcement }} />
    {/each}
    <div use:bottomIntersectionAction></div>
  </div>
</ChannelView>
<Loading show={$loading} />

<style lang="scss">
  .announcement {
    content-visibility: auto;
  }
</style>
