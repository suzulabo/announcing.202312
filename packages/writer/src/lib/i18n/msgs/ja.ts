const msgs = {
  signIn: '{{value}}でログイン',
  signOut: 'ログアウト',
  back: '戻る',
  cancel: 'キャンセル',
  maxLength: '{{num}}文字以内で入力してください',
  maxLengthOptional: '{{num}}文字以内で入力してください(省略可)',
  top: {
    createChannel: '新しいチャンネルを作る',
  },
  channel: {
    edit: '編集する',
    newPost: '新しいお知らせを書く',
    write: {
      title: {
        new: '新しいチャンネルの作成',
        edit: 'チャンネルの編集',
      },
      input: {
        title: 'タイトル',
        icon: {
          select: 'アイコンを選択',
          remove: 'アイコンを削除',
        },
        desc: '説明文',
        submit: { new: '作成する', edit: '更新する' },
      },
    },
    announcement: {
      write: {
        title: {
          new: '新しいお知らせを書く',
          edit: 'お知らせの編集',
        },
        input: {
          submit: { new: '作成する', edit: '更新する' },
        },
      },
    },
  },
};

export default msgs;
