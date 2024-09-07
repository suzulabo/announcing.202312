const sizePattern = new RegExp('([0-9]+)x([0-9]+)');

export const parseImageSize = (src: string) => {
  const m = sizePattern.exec(src);
  if (!m) {
    return;
  }
  const [, w, h] = m;
  if (!w || !h) {
    return;
  }
  return {
    width: +w,
    height: +h,
  };
};

export const parseImageSrc = (
  src: string | undefined,
  maxSize?: { width?: number; height?: number },
) => {
  if (!src) {
    return {};
  }

  const m = sizePattern.exec(src);
  if (!m) {
    return { src };
  }
  const [, w, h] = m;
  if (!w || !h) {
    return { src };
  }

  const result = {
    src,
    width: +w,
    height: +h,
  };

  const scaling = (() => {
    if (maxSize) {
      if (maxSize.width && maxSize.height) {
        return Math.min(maxSize.width / result.width, maxSize.height / result.height);
      } else if (maxSize.width) {
        return maxSize.width / result.width;
      } else if (maxSize.height) {
        return maxSize.height / result.height;
      }
    }
    return 1;
  })();

  if (scaling !== 1) {
    result.width = result.width * scaling;
    result.height = result.height * scaling;
  }

  return result;
};
