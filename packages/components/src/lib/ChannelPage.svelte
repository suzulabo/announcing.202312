<script lang="ts" context="module">
  // Re-export
  export type { ChannelPageParams } from './ChannelPage';
</script>

<script lang="ts">
  import { type ChannelPageParams, setup } from './ChannelPage';
  import { loadChannelViewComponents } from './ChannelView/loader';
  import Loading from './Loading.svelte';

  export let params: ChannelPageParams;

  $: ({ store, bottomIntersectionAction, listIntersectionAction, channelViewParams } =
    setup(params));
</script>

{#await loadChannelViewComponents()}
  <Loading show={true} />
{:then { ChannelView, AnnouncementView }}
  <ChannelView params={channelViewParams}>
    {#each $store.entries() as [key, a]}
      {#each a as v}
        <div
          class="items-chunk"
          use:listIntersectionAction={{ key, value: v }}
          style={`--height:${v.height ?? 'auto'}`}
        >
          {#if v.visible}
            <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars } -->
            {#each Array(v.count) as _, i}
              <div>
                <AnnouncementView params={$store.getAnnouncementViewParams(key, v.pos + i)} />
              </div>
            {/each}
          {/if}
        </div>
      {/each}
    {/each}
    <div class="__bottom__" use:bottomIntersectionAction></div>
  </ChannelView>
{/await}

<style lang="scss">
  .items-chunk {
    height: var(--height);
  }
</style>
