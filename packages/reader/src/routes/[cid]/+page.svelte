<script lang="ts">
  import {
    type AnnouncementProp,
    type ChannelProp,
    loadChannelPageComponents,
  } from '@announcing/components/ChannelView/loader';
  import Loading from '@announcing/components/Loading.svelte';

  import type { PageServerData } from './$types';

  export let data: PageServerData;

  const toViewProps = () => {
    const channel = data.channel;
    const channelProp: ChannelProp = {
      title: channel.title,
      desc: channel.desc,
      icon: channel.icon && `/s/${channel.icon}`,
      links: channel.links,
      count: channel.announcements?.length ?? 0,
    };
    const announcementPropList: AnnouncementProp[] =
      channel.announcements?.map<AnnouncementProp>((v) => {
        return {
          id: v.id,
          headerImage: v.headerImage && `/s/${v.headerImage}`,
          title: v.title,
          body: v.body,
          images: v.images?.map((v) => `/s/${v}`),
          links: v.links,
          updatedAt: new Date(v.updatedAt),
          createdAt: new Date(v.createdAt),
        };
      }) ?? [];

    return { channelProp, announcementPropList };
  };

  $: viewProps = toViewProps();
</script>

{#await loadChannelPageComponents()}
  <Loading show={true} />
{:then { ChannelView, AnnouncementView }}
  <ChannelView channel={viewProps.channelProp}>
    {#each viewProps.announcementPropList as announcement}
      <AnnouncementView {announcement} />
    {/each}
  </ChannelView>
{/await}

<style lang="scss">
</style>
