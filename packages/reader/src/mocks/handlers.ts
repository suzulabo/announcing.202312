import { delay, http, HttpResponse } from 'msw';

export const handlers = [
  http.get('https://test.mock/announcing.json', () => {
    return HttpResponse.json(
      {
        updated: '2024-01-01T22:33:44Z',
        info: {
          name: 'ヴィジョンテック・デジタル',
          desc: '最新のテクノロジーを駆使し、人々の生活を豊かにする企業の一員です💼✨革新的なソリューションを提供し、世界を変えることを使命としています🌍💡',
          icon: 'https://gist.githubusercontent.com/suzulabo/f9734844ae1a6557c8c4abc6db429093/raw/69c64522e3ce1c8a8594eb9cb049fbdaa64833f8/announcing-dummy-logo.jpg',
          link: 'https://VisionTech-Digital.dummy/',
        },
        posts: [
          {
            id: '1',
            published: '2024-01-01T22:33:44Z',
            title: '新AIサービスリリース！',
            body: '弊社、最新のAI搭載サービスをリリースしました！ビジネスの効率化や成長を支援します。詳細はウェブサイトでご確認ください。',
          },
          {
            id: '2',
            published: '2024-01-01T22:33:44Z',
            title: 'ウェビナー開催！',
            body: '次回のウェビナーが決定しました！最新テクノロジートレンドやビジネス戦略について楽しく学びましょう。参加登録は今すぐ！',
          },
          {
            id: '3',
            published: '2024-01-01T22:33:44Z',
            title: 'サイトメンテナンスのお知らせ',
            body: '週末にウェブサイトのメンテナンスを実施予定です！ご迷惑をおかけいたしますが、より快適なサービス提供のため、ご理解とご協力をお願いいたします。',
          },
          {
            id: '4',
            published: '2024-01-01T22:33:44Z',
            title: '新規採用情報！',
            body: '新しい仲間を募集中！クリエイティブでパッションある方、一緒に成長しましょう！詳細はウェブサイトでご確認ください。',
          },
          {
            id: '5',
            published: '2024-01-01T22:33:44Z',
            title: '年末セール開催中！',
            body: '年末大セール開催中！最新テックグッズやソフトウェア、お得な価格で提供中！お見逃しなく！',
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
