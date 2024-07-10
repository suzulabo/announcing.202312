<script lang="ts">
  import type { Hst } from '@histoire/plugin-svelte';
  import { parseISO } from 'date-fns';

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
      title: 'New Year Announcement',
      body: 'Aether Dynamics Corporation is thrilled to usher in 2024 with innovative solutions that drive progress. Stay tuned for exciting developments!',
      updatedAt: parseISO('2024-01-01T00:11:22'),
      createdAt: parseISO('2024-01-01T00:11:22'),
    },
    {
      id: '2',
      body: 'At Aether Dynamics Corporation, our mission is to enhance technology for a better tomorrow. Thank you for your continued support and partnership.',
      updatedAt: parseISO('2024-01-02T00:11:22'),
      createdAt: parseISO('2024-01-02T00:11:22'),
    },
    {
      id: '3',
      title: 'Quarterly Update',
      body: 'We are proud to announce significant milestones this quarter. Aether Dynamics Corporation is on track to exceed its targets and set new industry standards.',
      updatedAt: parseISO('2024-01-03T00:11:22'),
      createdAt: parseISO('2024-01-03T00:11:22'),
    },
    {
      id: '4',
      body: 'Our team at Aether Dynamics Corporation continues to innovate and improve our services. We appreciate your feedback and look forward to delivering excellence.',
      updatedAt: parseISO('2024-01-04T00:11:22'),
      createdAt: parseISO('2024-01-04T00:11:22'),
    },
    {
      id: '5',
      title: 'Special Announcement',
      body: 'Aether Dynamics Corporation is excited to introduce a new product line that redefines efficiency and performance. Stay connected for more details.',
      updatedAt: parseISO('2024-01-05T00:11:22'),
      createdAt: parseISO('2024-01-05T00:11:22'),
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
