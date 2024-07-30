import { faker } from '@faker-js/faker';
import { addDays, parseISO } from 'date-fns';

import type { ChannelPageParams } from '$lib/ChannelPage';
import type { AnnouncementViewParams } from '$lib/ChannelView/types';

type Announcement = Exclude<AnnouncementViewParams['announcement'], undefined>;

faker.seed(1192);

let num = 100;
let date = parseISO('2023-12-31T00:11:22');

const GEN_DATA_LENGTH = 100;

const genData = () => {
  const result: Announcement[] = [];

  for (let i = 0; i < GEN_DATA_LENGTH; i++) {
    const id = (num++).toString();
    const title = `[${id}] ${faker.lorem.sentence()}`;
    const body = faker.lorem.text();
    result.push({ id, title, body, createdAt: date, updatedAt: date });
    date = addDays(date, -1);
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
  ] as Announcement[]
).concat(...genData());

const dataMap = new Map<string, Announcement[]>();
for (let i = 2; i <= 6; i++) {
  dataMap.set(i.toString(), genData());
}

export const params: ChannelPageParams = {
  channel: {
    title: 'Aether Dynamics Corporation',
    desc: 'Aether Dynamics Corporation is at the forefront of cutting-edge technology, pioneering advancements in energy solutions and sustainable innovation.\nJoin us as we transform the future with dynamic, visionary science.',
    icon: '/assets/logo.jpg',
    links: null,
  },

  segments: [
    {
      key: '1',
      count: announcements.length,
    },
    {
      key: '2',
      count: GEN_DATA_LENGTH,
    },
    {
      key: '3',
      count: GEN_DATA_LENGTH,
    },
    {
      key: '4',
      count: GEN_DATA_LENGTH,
    },
    {
      key: '5',
      count: GEN_DATA_LENGTH,
    },
    {
      key: '6',
      count: GEN_DATA_LENGTH,
    },
  ],

  loader: (key: string) => {
    if (key === '1') {
      return Promise.resolve(announcements);
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(dataMap.get(key) ?? []);
      }, 1000);
    });
  },

  msgs: {
    noAnnouncements: 'No announcement yet.',
  },
};
