<script lang="ts">
  import {
    type AnnouncementViewData,
    type ChannelPageData,
    loadChannelPageComponents,
  } from '@announcing/components/channelPage/loader';
  import Loading from '@announcing/components/Loading.svelte';

  import type { PageServerData } from './$types';

  export let data: PageServerData;

  const toDispData = () => {
    const channel = data.channel;
    const channelPageData: ChannelPageData = {
      channel: {
        title: channel.title,
        desc: channel.desc,
        icon: channel.icon && `/s/${channel.icon}`,
        links: channel.links,
        count: channel.announcements?.length ?? 0,
      },
    };
    const announcementViewData: AnnouncementViewData[] =
      channel.announcements?.map<AnnouncementViewData>((v) => {
        return {
          announcement: {
            id: v.id,
            headerImage: v.headerImage && `/s/${v.headerImage}`,
            title: v.title,
            body: v.body,
            images: v.images?.map((v) => `/s/${v}`),
            links: v.links,
            updatedAt: new Date(v.updatedAt),
            createdAt: new Date(v.createdAt),
          },
        };
      }) ?? [];

    return { channelPageData, announcementViewData };
  };

  $: dispData = toDispData();
</script>

{#await loadChannelPageComponents()}
  <Loading show={true} />
{:then { Page, AnnouncementView }}
  <Page data={dispData.channelPageData}>
    {#each dispData.announcementViewData as announcement}
      <AnnouncementView data={announcement} />
    {/each}
  </Page>
{/await}

<style lang="scss">
</style>
