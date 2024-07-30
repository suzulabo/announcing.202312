<script lang="ts" context="module">
  // Re-export
  export type { ChannelPageParams } from './ChannelPage';
</script>

<script lang="ts">
  import { type ChannelPageParams, setup, sliceAnnouncements } from './ChannelPage2';
  import { loadChannelViewComponents } from './ChannelView/loader';
  import Loading from './Loading.svelte';

  export let params: ChannelPageParams;

  $: ({
    store,
    bottomIntersectionAction,
    segmentIntersectionAction,
    chunkIntersectionAction,
    channelViewParams,
  } = setup(params));
</script>

{#await loadChannelViewComponents()}
  <Loading show={true} />
{:then { ChannelView, AnnouncementView }}
  <ChannelView params={channelViewParams}>
    {#each $store.segments() as segment, i}
      <div
        class={`segment ${segment.visible ? '' : 'hidden'}`}
        style="{`--height': ${segment.height}`}}"
        use:segmentIntersectionAction={i}
      >
        {#await segment.announcements}
          <Loading />
        {:then announcements}
          {#each segment.chunks as chunk, o}
            <div
              class={`chunk ${chunk.visible ? '' : 'hidden'}`}
              style="{`--height': ${chunk.height}`}}"
              use:chunkIntersectionAction={[i, o]}
            >
              {#if chunk.visible}
                <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars } -->
                {#each sliceAnnouncements(chunk, announcements) as announcement}
                  <div>
                    <AnnouncementView params={{ announcement }} />
                  </div>
                {/each}
              {/if}
            </div>
          {/each}
        {/await}
      </div>
    {/each}
    <div class="__bottom__" use:bottomIntersectionAction></div>
  </ChannelView>
{/await}

<style lang="scss">
  .segment {
    display: contents;
    height: var(--height);

    &.hidden {
      display: block;
    }
  }

  .chunk {
    display: contents;
    height: var(--height);

    &.hidden {
      display: block;
    }
  }
</style>
