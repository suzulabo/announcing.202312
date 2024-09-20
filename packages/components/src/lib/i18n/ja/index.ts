import type { Translation } from '../i18n-types';

const ja = {
  edit: '編集',
  delete: '削除',
  cancel: 'キャンセル',
  back: '戻る',
  preview: '確認',
  settings: '設定',
  copy: 'コピー',
  copied: 'コピーしました',
  copyError: 'コピーできませんでした',
  required: '(必須)',
  channelName: 'チャンネル名',
  title: 'タイトル',
  desc: '説明文',
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
} satisfies Translation;

export default ja;
