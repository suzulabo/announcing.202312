<script lang="ts">
  import type { Hst } from '@histoire/plugin-svelte';

  import AnnouncementView from '$lib/channelPage/default/AnnouncementView.svelte';
  import { loadChannelPageComponents } from '$lib/channelPage/loader';

  // eslint-disable-next-line no-import-assign
  export let Hst: Hst;

  const pageData = {
    channel: {
      title: 'Announcing announcements',
      desc: 'This is Page Component',
      icon: null,
      links: null,
      count: 5,
      createdAt: new Date(),
    },
  };
  const announcements = [
    {
      id: '1',
      body: 'Hello',
      updatedAt: new Date(),
      createdAt: new Date(),
    },
    {
      id: '2',
      body: 'Hi',
      updatedAt: new Date(),
      createdAt: new Date(),
    },
    {
      id: '3',
      body: 'Goode bye',
      updatedAt: new Date(),
      createdAt: new Date(),
    },
  ];
</script>

<Hst.Story title="Channel Page">
  {#await loadChannelPageComponents()}
    Loading...
  {:then { Page }}
    <Page data={pageData}>
      {#each announcements as announcement}
        <AnnouncementView data={{ announcement }} />
      {/each}
    </Page>
  {/await}
</Hst.Story>
