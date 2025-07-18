import NodeFetchCache, { FileSystemCache } from 'node-fetch-cache';
import { readFileSync, writeFileSync } from 'node:fs';
import { stringify } from 'node:querystring';
import { setTimeout } from 'node:timers/promises';

type JsonData = {
  announcements: {
    tags: string[];
    createdAt: string;
    headerImage?: string;
    images?: string[];
  }[];
};

type PixabayResult = {
  hits: {
    largeImageURL: string;
  }[];
};

const PIXABAY_API_KEY = process.env['PIXABAY_API_KEY'];

const fetch = NodeFetchCache.create({
  cache: new FileSystemCache({ cacheDirectory: 'tools/importData/dist/fetchCache' }),
});

const imageControls = [
  {
    options: { orientation: 'horizontal', min_width: 1000 },
    handle: (announcement: JsonData['announcements'][number], pixabayResult: PixabayResult) => {
      const [hit] = pixabayResult.hits;
      if (hit) {
        announcement.headerImage = hit.largeImageURL;
      }
    },
  },
  {
    options: { orientation: 'vertical', min_height: 1000 },
    handle: (announcement: JsonData['announcements'][number], pixabayResult: PixabayResult) => {
      const [hit] = pixabayResult.hits;
      if (hit) {
        announcement.headerImage = hit.largeImageURL;
      }
    },
  },
  {
    options: { orientation: 'horizontal', min_width: 1000 },
    handle: (announcement: JsonData['announcements'][number], pixabayResult: PixabayResult) => {
      const [hit] = pixabayResult.hits;
      if (hit) {
        announcement.images = [hit.largeImageURL];
      }
    },
  },
  {
    options: { orientation: 'vertical', min_height: 1000 },
    handle: (announcement: JsonData['announcements'][number], pixabayResult: PixabayResult) => {
      const [hit] = pixabayResult.hits;
      if (hit) {
        announcement.images = [hit.largeImageURL];
      }
    },
  },
  {
    options: { min_width: 600, min_height: 600 },
    handle: (announcement: JsonData['announcements'][number], pixabayResult: PixabayResult) => {
      const [hit] = pixabayResult.hits;
      if (hit) {
        announcement.headerImage = hit.largeImageURL;
      }
      announcement.images = pixabayResult.hits.slice(1, 5).map((v) => v.largeImageURL);
    },
  },
  {
    options: { min_width: 600, min_height: 600 },
    handle: (announcement: JsonData['announcements'][number], pixabayResult: PixabayResult) => {
      announcement.images = pixabayResult.hits.slice(0, 4).map((v) => v.largeImageURL);
    },
  },
] as const;

const searchPixabay = async (tags: string[], options: Record<string, unknown>) => {
  const params = stringify({
    key: PIXABAY_API_KEY,
    safesearch: 'true',
    image_type: 'photo',
    per_page: 10,
    q: tags.join(' '),
    ...options,
  });

  const url = `https://pixabay.com/api/?${params}`;

  console.log(`fetch: ${url}`);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Search Error');
  }

  if (!res.returnedFromCache) {
    await setTimeout(1000);
  }

  return await res.json();
};

const processJson = async (json: JsonData, lang: string) => {
  json.announcements.sort((a, b) => {
    return b.createdAt.localeCompare(a.createdAt);
  });

  let i = 0;

  for (const announcement of json.announcements) {
    const control = imageControls[i];
    if (!control) {
      i = 0;
      continue;
    }

    const res = await searchPixabay(announcement.tags, { ...control.options, lang });
    control.handle(announcement, res as PixabayResult);
    i++;
  }

  json.announcements.reverse();
};

const main = async () => {
  const jsonFile = process.argv[2];
  if (!jsonFile) {
    console.log('no filename argument');
    return;
  }

  const m = jsonFile.match(/^.+_(..)\.json$/);
  const lang = (m ? m[1] : '') ?? '';

  const json = JSON.parse(readFileSync(jsonFile, 'utf8'));
  await processJson(json, lang);
  const newFile = jsonFile.replace('.json', '_imageAdded.json');
  writeFileSync(newFile, JSON.stringify(json, undefined, 2));
};

await main();
