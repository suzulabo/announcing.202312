<script lang="ts" context="module">
  import { faker } from '@faker-js/faker';
  import { Story } from '@storybook/addon-svelte-csf';
  import type { Meta } from '@storybook/svelte';
  import { addDays } from 'date-fns';

  import ChannelPage from '$lib/ChannelPage/ChannelPage.svelte';
  import type { AnnouncementLoaderFunction, Channel } from '$lib/ChannelPage/types';

  export const meta = {
    title: 'ChannelPageV2/default',
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

  const announcementKeys = Array.from({ length: 100 }, (_, i) => (i + 1).toString());

  const announcementLoader: AnnouncementLoaderFunction = (key: string) => {
    const keyNum = +key;
    faker.seed(keyNum);
    const date = addDays('2023-12-31T00:11:22', keyNum * -1);

    const result = {
      id: key,
      title: `[${key}] ${faker.lorem.sentence()}`,
      body: faker.lorem.text(),
      updatedAt: date,
      createdAt: date,
    };

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(result);
      }, 500);
    });
  };
</script>

<Story name="Basic">
  <ChannelPage viewName="default" {channel} {announcementKeys} {announcementLoader} />
</Story>
