<script lang="ts">
  import { faker } from '@faker-js/faker';
  import { addDays } from 'date-fns';

  import type { Announcement } from '$lib/parts/AnnouncementView/AnnouncementView';
  import type {
    AnnouncementLoaderFunction,
    ChannelViewProps,
  } from '$lib/parts/ChannelView/ChannelView';
  import ChannelView from '$lib/parts/ChannelView/ChannelView.svelte';
  import { page } from '$app/state';
  import { createSnapshotContext } from '$lib/utils/snapshotContext.js';

  export const snapshot = createSnapshotContext();

  const loaded = new Set<string>();
  const announcementKeys = Array.from({ length: 100 }, (_, i) => (i + 1).toString());
  const announcementLoader: AnnouncementLoaderFunction = (key: string) => {
    const keyNum = +key;
    faker.seed(keyNum + 100);
    const date = addDays('2023-12-31T00:11:22', keyNum * -1).getTime();
    const result: Announcement = {
      title: `[${key}] ${faker.lorem.sentence()}`,
      body: faker.lorem.paragraphs({
        min: 1,
        max: 6,
      }),
      updatedAt: date,
      createdAt: date,
    };
    if (keyNum <= 30) {
      switch (keyNum % 5) {
        case 1:
          result.headerImage = '/assets/1_550x368.webp';
          break;
        case 2:
          result.headerImage = '/assets/cat-8575641_427x640.jpg';
          break;
        case 3:
          result.images = [
            '/assets/gecko-8483282_640x452.png',
            '/assets/background-7000157_1920x1357.jpg',
            '/assets/cat-8612685_640_small_100x150.jpg',
            '/assets/music-8559592_441x640.jpg',
          ];
          break;
        case 4:
          result.images = ['/assets/gecko-8483282_640x452.png'];
          break;
      }
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

  const props: ChannelViewProps = {
    channel: {
      name: 'Aether Dynamics Corporation',
      desc: 'Aether Dynamics Corporation is at the forefront of cutting-edge technology, pioneering advancements in energy solutions and sustainable innovation.\nJoin us as we transform the future with dynamic, visionary science.',
      icon: '/assets/logo.png',
    },
    announcementHrefPrefix: `${page.url.pathname}/announcements`,
    announcementKeys,
    announcementLoader,
  };
</script>

<div class="container">
  <ChannelView {...props} />
</div>

<style lang="scss">
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 8px 0;
  }
</style>
