import type { PageLoad } from './$types';

export const ssr = false;

export const load: PageLoad = async ({ data, fetch }) => {
  if (data.icon) {
    const res = await fetch(`/s/${data.icon}`);

    if (res.ok) {
      const b = await res.blob();

      data.form.data.icon = new File([b], 'icon.image', {
        type: res.headers.get('Content-Type') ?? '',
      });
    }
  }

  return { ...data };
};
