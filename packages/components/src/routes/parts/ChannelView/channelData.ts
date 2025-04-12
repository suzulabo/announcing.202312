import { faker } from '@faker-js/faker';
import { addDays } from 'date-fns';

faker.seed(100);

type Announcement = {
  headerImage?: string | undefined;
  title?: string | undefined;
  body: string;
  images?: string[] | undefined;
  updatedAt: number;
  createdAt: number;
};

const genDate = (n: number) => {
  return addDays('2025-01-01T00:11:22', n).getTime();
};

const genData = (): Map<string, Announcement> => {
  const data = new Map<string, Announcement>();

  data.set('1', {
    headerImage: '/assets/duck-7713310_1280x853.jpg',
    title: 'Landscape header',
    body: faker.lorem.paragraphs(),
    updatedAt: genDate(1),
    createdAt: genDate(1),
  });

  data.set('2', {
    headerImage: '/assets/duck-7829778_960x1280.jpg',
    title: 'Portrait header',
    body: faker.lorem.paragraphs(),
    updatedAt: genDate(2),
    createdAt: genDate(2),
  });

  data.set('3', {
    headerImage: '/assets/ducklings-1853178_1280x989.jpg',
    title: 'Portrait header is more boxy',
    body: faker.lorem.paragraphs(),
    updatedAt: genDate(3),
    createdAt: genDate(3),
  });

  return data;
};

export const channelData = genData();
