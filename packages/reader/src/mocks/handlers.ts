import { delay, http, HttpResponse } from 'msw';

export const handlers = [
  http.get('https://test.mock/announcing.json', () => {
    return HttpResponse.json(
      {},
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      },
    );
  }),
  http.get('https://test.mock/nocors.json', () => {
    return HttpResponse.json({});
  }),
  http.get('https://test.mock/timeout.json', async () => {
    await delay(11 * 1000);
    return HttpResponse.json({});
  }),
];
