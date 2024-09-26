import type { Action } from 'svelte/action';

import { loadBlob } from '$lib/utils/idbBlob';

class SrcSetter {
  private objectURL: string | undefined = undefined;
  private serial = 0;

  constructor(private img: HTMLImageElement) {
    this.img.addEventListener('load', () => {
      this.revoke();
    });
  }

  set(src: string) {
    this.revoke();
    if (!src.startsWith('idb://')) {
      this.img.src = src;
      return;
    }

    void (async (curSerial: number) => {
      const blob = await loadBlob(src);
      if (!blob) {
        return;
      }
      if (this.serial !== curSerial) {
        return;
      }
      this.objectURL = URL.createObjectURL(blob);
      this.img.src = this.objectURL;
    })(++this.serial);
  }

  revoke() {
    if (this.objectURL) {
      URL.revokeObjectURL(this.objectURL);
      this.objectURL = undefined;
    }
  }
}

export const imgSrc: Action<HTMLImageElement, string> = (img: HTMLImageElement, src: string) => {
  const setter = new SrcSetter(img);

  setter.set(src);

  return {
    update: (src: string) => {
      setter.set(src);
    },
    destroy: () => {
      setter.revoke();
    },
  };
};
