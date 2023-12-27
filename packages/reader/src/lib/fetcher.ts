type FetchFunction = typeof fetch;

export class Fetcher {
  constructor(private fetch: FetchFunction) {}

  get(url: string) {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, 10 * 1000);
    try {
      return this.fetch(url);
    } finally {
      clearTimeout(timeout);
    }
  }
}
