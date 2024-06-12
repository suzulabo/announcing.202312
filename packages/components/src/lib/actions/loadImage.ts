import type { Action } from 'svelte/action';

const load = (img: HTMLImageElement, file: File | undefined) => {
  if (!file) {
    img.src = '';

    return;
  }

  const reader = new FileReader();

  reader.onload = (event) => {
    img.src = event.target?.result as string;
  };

  reader.readAsDataURL(file);
};

export const loadImage: Action<HTMLImageElement, File | undefined> = (img, file) => {
  load(img, file);

  return {
    update: (file) => {
      load(img, file);
    },
  };
};
