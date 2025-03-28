const open = async (caches: CacheStorage) => {
  return await caches.open('app-caches');
};

export const APP_CACHES_PREFIX = '/_caches/';

export const putBlob = async (caches: CacheStorage, id: string, blob: Blob) => {
  const url = `${APP_CACHES_PREFIX}${id}`;
  const cache = await open(caches);
  await cache.put(url, new Response(blob));

  return url;
};

export const getResponse = async (caches: CacheStorage, url: string) => {
  const cache = await open(caches);
  return cache.match(url);
};
