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

  set(src: string | undefined) {
    this.revoke();
    if (!src) {
      this.img.src = '';
      return;
    }
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

export const imgSrc: Action<HTMLImageElement, string | undefined> = (
  img,
  src: string | undefined,
) => {
  const setter = new SrcSetter(img);

  setter.set(src);

  return {
    update: (src) => {
      setter.set(src);
    },
    destroy: () => {
      setter.revoke();
    },
  };
};
