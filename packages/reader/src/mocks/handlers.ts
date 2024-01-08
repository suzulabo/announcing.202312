import { delay, http, HttpResponse } from 'msw';

export const handlers = [
  http.get('https://test.mock/announcing.json', () => {
    return HttpResponse.json(
      {
        updated: '2024-01-01T22:33:44',
        info: {
          name: 'ヘブンバーンズレッド公式',
          desc: 'ライトフライヤースタジオ× Keyが贈る、麻枝 准 15年ぶりの完全新作ゲーム『ヘブンバーンズレッド（ヘブバン）』の公式Twitterです。App Store/Google Play/Steamで配信中',
          icon: 'https://pbs.twimg.com/profile_images/1664453907198906369/BQWJVvKg_400x400.jpg',
          link: 'https://heaven-burns-red.com/',
        },
        posts: [
          {
            id: '1',
            published: '2024-01-01T22:33:44',
            title: 'post1',
          },
          {
            id: '2',
            published: '2024-01-01T22:33:44',
            body: 'post2',
          },
        ],
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      },
    );
  }),
  http.get('https://test.mock/en/announcing.json', () => {
    return HttpResponse.json(
      {
        updated: '2024-01-01T22:33:44',
        info: {
          name: 'DISSIDIA FINAL FANTASY OPERA OMNIA',
          desc: 'Welcome to the official DISSIDIA FINAL FANTASY OPERA OMNIA Twitter page!\nGoogle Play: http://sqex.to/dffoo_android\nApp Store: http://sqex.to/dffoo_ios',
          icon: 'https://pbs.twimg.com/profile_images/1651664225276928000/kTmkcbpj_400x400.jpg',
        },
        posts: [],
      },
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
