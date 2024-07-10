<script lang="ts">
  import type { Hst } from '@histoire/plugin-svelte';

  import AnnouncementView from '$lib/channelPage/default/AnnouncementView.svelte';
  import { loadChannelPageComponents } from '$lib/channelPage/loader';
  import Loading from '$lib/Loading.svelte';

  import { Aether_Dynamics_Corporation_icon } from './res/Aether_Dynamics_Corporation_icon';

  // eslint-disable-next-line no-import-assign
  export let Hst: Hst;

  const pageData = {
    channel: {
      title: 'Aether Dynamics Corporation',
      desc: 'Aether Dynamics Corporation is at the forefront of cutting-edge technology, pioneering advancements in energy solutions and sustainable innovation.\nJoin us as we transform the future with dynamic, visionary science.',
      icon: Aether_Dynamics_Corporation_icon,
      links: null,
      count: 5,
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
    <Loading show={true} />
  {:then { Page }}
    <Page data={pageData}>
      {#each announcements as announcement}
        <AnnouncementView data={{ announcement }} />
      {/each}
    </Page>
  {/await}
</Hst.Story>
