<script lang="ts" context="module">
  import { Story } from '@storybook/addon-svelte-csf';
  import type { Meta } from '@storybook/svelte';
  import { parseISO } from 'date-fns';

  import AnnouncementPage from '$lib/ChannelPage/AnnouncementPage.svelte';
  import type { Channel } from '$lib/ChannelPage/types';

  export const meta = {
    title: 'AnnouncementPage/default',
    tags: ['autodocs', 'wait-.main'],
    parameters: {
      layout: 'fullscreen',
    },
  } satisfies Meta;

  const channel: Channel = {
    title: 'Aether Dynamics Corporation',
    desc: 'Aether Dynamics Corporation is at the forefront of cutting-edge technology, pioneering advancements in energy solutions and sustainable innovation.\nJoin us as we transform the future with dynamic, visionary science.',
    icon: '/assets/logo.png',
  };
</script>

<Story name="Basic">
  <AnnouncementPage
    theme="default"
    {channel}
    announcement={{
      id: '1',
      headerImage: '/assets/1_550x368.webp',
      title: 'New Year Announcement',
      body: 'Aether Dynamics Corporation is thrilled to usher in 2024 with innovative solutions that drive progress. Stay tuned for exciting developments!',
      updatedAt: parseISO('2024-01-01T00:11:22'),
      createdAt: parseISO('2024-01-01T00:11:22'),
    }}
    backURL="#"
  />
</Story>
