import type { PageLoad } from './$types';

export const ssr = false;

export const load: PageLoad = async ({ data, params, fetch }) => {
  const fetchFile = async (id: string, cb: (f: File) => void) => {
    const res = await fetch(`/s/${id}`);

    if (res.ok) {
      const b = await res.blob();

      cb(
        new File([b], 'icon.image', {
          type: res.headers.get('Content-Type') ?? '',
        }),
      );
    }
  };

  const fetchers: Promise<void>[] = [];

  if (data.headerImage) {
    fetchers.push(fetchFile(data.headerImage, f => (data.form.data.headerImage = f)));
  }

  if (data.images) {
    const files: File[] = [];

    data.form.data.images = files;
    fetchers.push(...data.images.map((v, i) => fetchFile(v, f => (files[i] = f))));
  }

  await Promise.all(fetchers);

  return { ...data, cid: params.cid };
};
