import { faker } from '@faker-js/faker';
import { addDays } from 'date-fns';

import type { Announcement } from '$lib/parts/AnnouncementView/AnnouncementView.svelte';
import type {
  AnnouncementLoaderFunction,
  ChannelViewParams,
} from '$lib/parts/ChannelView/ChannelView.svelte';

export const genAnnouncementLoader = () => {
  const loaded = new Set<string>();
  const announcementKeys = Array.from({ length: 100 }, (_, i) => (i + 1).toString());
  const announcementLoader: AnnouncementLoaderFunction = (key: string) => {
    const keyNum = +key;
    faker.seed(keyNum + 100);
    const date = addDays('2023-12-31T00:11:22', keyNum * -1);

    let headerImage: string | undefined = undefined;
    switch (keyNum) {
      case 1:
        headerImage = '/assets/1_550x368.webp';
        break;
      case 2:
        headerImage = '/assets/cat-8575641_427x640.jpg';
        break;
    }
    const result: Announcement = {
      id: key,
      headerImage,
      title: `[${key}] ${faker.lorem.sentence()}`,
      body: faker.lorem.text(),
      updatedAt: date,
      createdAt: date,
    };

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

  return {
    announcementKeys,
    announcementLoader,
  };
};

export const genChannelViewParams = (announcementHrefPrefix: string) => {
  const params: ChannelViewParams = {
    channel: {
      name: 'Aether Dynamics Corporation',
      desc: 'Aether Dynamics Corporation is at the forefront of cutting-edge technology, pioneering advancements in energy solutions and sustainable innovation.\nJoin us as we transform the future with dynamic, visionary science.',
      icon: '/assets/logo.png',
    },
    ...genAnnouncementLoader(),
    announcementHrefPrefix,
  };

  return params;
};
