import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('https://test.mock/', () => {
    return HttpResponse.json(
      { status: 200 },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      },
    );
  }),
];
