import { delay, http, HttpResponse } from 'msw';

export const handlers = [
  http.get('https://test.mock/announcing.json', () => {
    return HttpResponse.json(
      {
        updated: '2024-01-01T22:33:44Z',
        info: {
          name: 'ヘブンバーンズレッド公式',
          desc: 'ライトフライヤースタジオ× Keyが贈る、麻枝 准 15年ぶりの完全新作ゲーム『ヘブンバーンズレッド（ヘブバン）』の公式Twitterです。App Store/Google Play/Steamで配信中',
          icon: 'https://pbs.twimg.com/profile_images/1664453907198906369/BQWJVvKg_400x400.jpg',
          link: 'https://heaven-burns-red.com/',
        },
        posts: [
          {
            id: '1',
            published: '2024-01-01T22:33:44Z',
            title: '🎉ヘブンバーンズレッド2nd Anniversary Party!🎉',
            body: 'あと25日！\n\n【カウントダウンイラスト第2️⃣7️⃣弾】\nすいみゃ \n@suimya\n さんに\n大島二以奈を描いていただきました！\n\n2周年リアルイベントは2024年2月3,4日の2days開催！\n▼詳しくはこちら\nhttps://heaven-burns-red.com/2024party/',
          },
          {
            id: '2',
            published: '2024-01-01T22:33:44Z',
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
