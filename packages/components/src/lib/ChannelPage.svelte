<script lang="ts">
  import { type ChannelProp, setup } from './ChannelPage';
  import { loadChannelPageComponents } from './ChannelView/loader';
  import Loading from './Loading.svelte';

  export let channel: ChannelProp;

  $: ({ store, bottomIntersectionAction, listIntersectionAction } = setup(channel));
</script>

{#await loadChannelPageComponents()}
  <Loading show={true} />
{:then { ChannelView, AnnouncementView }}
  <ChannelView {channel}>
    {#each $store.itemsMap.entries() as [key, a]}
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
                <AnnouncementView announcement={$store.announcementsMap.get(key)?.[v.pos + i]} />
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
