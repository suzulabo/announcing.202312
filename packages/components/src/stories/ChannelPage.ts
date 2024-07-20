import { faker } from '@faker-js/faker';
import { addDays, parseISO } from 'date-fns';

import type { ChannelProp } from '$lib/ChannelPage.svelte';
import type { AnnouncementProp } from '$lib/ChannelView/types';

const genData = () => {
  faker.seed(1192);
  const result: AnnouncementProp[] = [];

  const startDate = parseISO('2023-09-20T00:11:22');

  for (let i = 0; i < 100; i++) {
    const title = faker.lorem.sentence();
    const body = faker.lorem.text();
    const d = addDays(startDate, i * -1);
    result.push({ id: (i + 100).toString(), title, body, createdAt: d, updatedAt: d });
  }

  return result;
};

const announcements = (
  [
    {
      id: '1',
      headerImage: '/assets/1.webp',
      title: 'New Year Announcement',
      body: 'Aether Dynamics Corporation is thrilled to usher in 2024 with innovative solutions that drive progress. Stay tuned for exciting developments!',
      updatedAt: parseISO('2024-01-01T00:11:22'),
      createdAt: parseISO('2024-01-01T00:11:22'),
    },
    {
      id: '2',
      headerImage: '/assets/cat-8575641_640.jpg',
      body: 'At Aether Dynamics Corporation, our mission is to enhance technology for a better tomorrow. Thank you for your continued support and partnership.',
      updatedAt: parseISO('2024-01-02T00:11:22'),
      createdAt: parseISO('2024-01-02T00:11:22'),
    },
    {
      id: '3',
      title: 'Quarterly Update',
      body: 'We are proud to announce significant milestones this quarter. Aether Dynamics Corporation is on track to exceed its targets and set new industry standards.',
      images: ['/assets/gecko-8483282_640.png'],
      updatedAt: parseISO('2024-01-03T00:11:22'),
      createdAt: parseISO('2024-01-03T00:11:22'),
    },
    {
      id: '4',
      body: 'Our team at Aether Dynamics Corporation continues to innovate and improve our services. We appreciate your feedback and look forward to delivering excellence.',
      images: [
        '/assets/chicks-8782391_640.jpg',
        '/assets/cat-8612685_640_small.jpg',
        '/assets/leaves-8846763_640.jpg',
        '/assets/music-8559592_640.jpg',
      ],
      updatedAt: parseISO('2024-01-04T00:11:22'),
      createdAt: parseISO('2024-01-04T00:11:22'),
    },
    {
      id: '5',
      headerImage: '/assets/background-7000157_1920.jpg',
      title: 'Special Announcement',
      body: 'Aether Dynamics Corporation is excited to introduce a new product line that redefines efficiency and performance. Stay connected for more details.',
      updatedAt: parseISO('2024-01-05T00:11:22'),
      createdAt: parseISO('2024-01-05T00:11:22'),
    },
  ] as AnnouncementProp[]
).concat(...genData());

export const channel: ChannelProp = {
  title: 'Aether Dynamics Corporation',
  desc: 'Aether Dynamics Corporation is at the forefront of cutting-edge technology, pioneering advancements in energy solutions and sustainable innovation.\nJoin us as we transform the future with dynamic, visionary science.',
  icon: '/assets/logo.jpg',
  links: null,

  announcementKeys: [
    {
      key: 'first',
      count: announcements.length,
    },
  ],

  announcementLoader: () => {
    return Promise.resolve(announcements);
  },
};
