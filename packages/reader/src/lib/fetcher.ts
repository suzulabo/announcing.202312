type FetchFunction = typeof fetch;

export class Fetcher {
  constructor(private fetch: FetchFunction) {}

  async get(url: string) {
    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, 10 * 1000);

    try {
      return await this.fetch(url, { signal: controller.signal });
    } finally {
      clearTimeout(timeout);
    }
  }
}
