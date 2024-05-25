import type { Action } from 'svelte/action';

const loadImage: Action<HTMLImageElement, File | undefined> = (img) => {
  return {
    update: (file) => {
      if (!file) {
        return;
      }

      const reader = new FileReader();

      reader.onload = (event) => {
        img.src = event.target?.result as string;
      };

      reader.readAsDataURL(file);
    },
  };
};

export default loadImage;
