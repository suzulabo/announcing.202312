/* eslint-disable @typescript-eslint/no-explicit-any */
const en = {
  edit: 'Edit',
  delete: 'Delete',
  cancel: 'Cancel',
  close: 'Close',
  remove: 'Remove',
  back: 'Back',
  preview: 'Preview',
  settings: 'Settings',
  copy: 'Copy',
  copied: 'Copied to clipboard.',
  copyError: 'Unable to copy to clipboard.',
  required: '(Required)',
  channelName: 'Channel name',
  desc: 'Description',
  title: 'Title',
  body: 'Body',
  selectIcon: 'Select icon',
  removeIcon: 'Remove',
  textTooLong: 'Your input exceeds the character limit.',
  noAnnouncements: 'No announcements yet.',
  createChannel: 'Create Channel',
  updateChannel: 'Update Channel',
  channelsCanBeCreated: 'Up to five channels can be created.',
  channelActions: {
    instruction: 'What would you like to do today? Please choose from the options below:',
    viewChannel: 'View this channel',
    copyURL: 'Copy channel URL',
    createAnnouncement: 'Create a new announcement',
    editAnnouncement: 'Edit or delete past announcements',
    editChannel: 'Edit channel name, etc.',
    deleteChannel: 'Delete this channel',
  },
  deleteChannel: 'Delete Channel',
  deleteChannelDescription:
    'You are about to delete the channel "{name}". This action cannot be undone.',
  deleteChannelUnderstand: 'I understand.',
  deleteChannelConfirmation: 'Are you sure you want to delete the channel?',
  postAnnouncement: 'Post announcement',
  updateAnnouncement: 'Edit announcement',
  chooseHeaderImage: 'Choose Header Image',
  removeHeaderImage: 'Remove',
  addImage: 'Add Image',
  addImageDescription: 'You can add up to 4 images.',
  announcementView: {
    created: 'Created: ',
    updated: 'Updated: ',
  },
};

const ja = {
  edit: '編集',
  delete: '削除',
  cancel: 'キャンセル',
  close: '閉じる',
  remove: '削除',
  back: '戻る',
  preview: '表示を確認',
  settings: '設定',
  copy: 'コピー',
  copied: 'コピーしました',
  copyError: 'コピーできませんでした',
  required: '(必須)',
  channelName: 'チャンネル名',
  desc: '説明文',
  title: 'タイトル',
  body: '本文',
  selectIcon: 'アイコンを選択',
  removeIcon: '選択解除',
  textTooLong: '入力が文字数制限を超えています',
  noAnnouncements: 'アナウンスはまだありません',
  createChannel: 'チャンネルを作成',
  updateChannel: 'チャンネルを更新',
  channelsCanBeCreated: 'チャンネルは5つまで作れます',
  channelActions: {
    instruction: '今日はなにをしましょうか。以下のメニューから選んでください。',
    viewChannel: 'チャンネルの表示を確認する',
    copyURL: 'チャンネルのURLをコピーする',
    createAnnouncement: '新しいお知らせを書く',
    editAnnouncement: '過去のお知らせを編集・削除する',
    editChannel: 'チャンネルの名前などを編集する',
    deleteChannel: 'チャンネルを削除する',
  },
  deleteChannel: 'チャンネルの削除',
  deleteChannelDescription: 'チャンネル「{name}」を削除します。この操作は元に戻せません。',
  deleteChannelUnderstand: '問題ありません',
  deleteChannelConfirmation: 'チャンネルを削除します。よろしいですか？',
  postAnnouncement: 'お知らせを投稿',
  updateAnnouncement: 'お知らせを編集',
  chooseHeaderImage: '見出し画像を選択',
  removeHeaderImage: '選択解除',
  addImage: '画像を追加',
  addImageDescription: '画像は4枚まで追加できます',
  announcementView: {
    created: '作成: ',
    updated: '更新: ',
  },
};

const convertNewFormat = () => {
  const convert = (o: any, lang: string, x: any) => {
    for (const [k, v] of Object.entries(o)) {
      if (typeof v === 'string') {
        x[k] = { ...x[k], [lang]: v };
      } else {
        if (!x[k]) {
          x[k] = {};
        }
        convert(v, lang, x[k]);
      }
    }
  };

  const x = {};
  convert(en, 'en', x);
  convert(ja, 'ja', x);

  return x;
};

const n = convertNewFormat();

console.log(JSON.stringify(n, undefined, 2));
