<script lang="ts">
  import { faker } from '@faker-js/faker';
  import { addDays } from 'date-fns';

  import type { Announcement } from '$lib/parts/AnnouncementView/AnnouncementView.svelte';
  import type {
    AnnouncementLoaderFunction,
    ChannelViewParams,
  } from '$lib/parts/ChannelView/ChannelView.svelte';
  import ChannelView from '$lib/parts/ChannelView/ChannelView.svelte';

  const loaded = new Set<string>();
  const announcementKeys = Array.from({ length: 100 }, (_, i) => (i + 1).toString());
  const announcementLoader: AnnouncementLoaderFunction = (key: string) => {
    const keyNum = +key;
    faker.seed(keyNum + 100);
    const date = addDays('2023-12-31T00:11:22', keyNum * -1).getTime();
    const result: Announcement = {
      title: `[${key}] ${faker.lorem.sentence()}`,
      body: faker.lorem.text(),
      updatedAt: date,
      createdAt: date,
    };
    switch (keyNum) {
      case 1:
        result.headerImage = '/assets/1_550x368.webp';
        break;
      case 2:
        result.headerImage = '/assets/cat-8575641_427x640.jpg';
        break;
    }

    if (loaded.has(key)) {
      return result;
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        loaded.add(key);
        resolve(result);
      }, 1000);
    });
  };

  const params: ChannelViewParams = {
    channel: {
      name: 'Aether Dynamics Corporation',
      desc: 'Aether Dynamics Corporation is at the forefront of cutting-edge technology, pioneering advancements in energy solutions and sustainable innovation.\nJoin us as we transform the future with dynamic, visionary science.',
      icon: '/assets/logo.png',
    },
    announcementHrefPrefix: '/parts/ChannelView/',
    announcementKeys,
    announcementLoader,
  };
</script>

<div class="container">
  <ChannelView {params} />
</div>

<style lang="scss">
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 8px;
  }
</style>
