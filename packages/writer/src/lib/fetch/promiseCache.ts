const cache = new Map<string, Promise<unknown>>()

export function promiseCache<T>(key: string, func: () => Promise<T>): Promise<T> {
  if (cache.has(key)) {
    return cache.get(key) as Promise<T>
  }

  const promise = func()
  cache.set(key, promise)
  promise.finally(() => {
    cache.delete(key)
  })

  return promise
}
