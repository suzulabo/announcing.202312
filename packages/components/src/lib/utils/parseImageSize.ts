const sizePattern = new RegExp('(\\d+)x(\\d+)')

export function parseImageSize(src: string) {
  const m = sizePattern.exec(src)
  if (!m) {
    return
  }
  const [, w, h] = m
  if (!w || !h) {
    return
  }
  return {
    width: +w,
    height: +h,
  }
}
