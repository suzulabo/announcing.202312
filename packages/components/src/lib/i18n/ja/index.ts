import type { Translation } from '../i18n-types';

const ja = {
  edit: '編集',
  delete: '削除',
  cancel: 'キャンセル',
  back: '戻る',
  preview: '確認',
  settings: '設定',
  required: '(必須)',
  title: 'タイトル',
  desc: '説明文',
  selectIcon: 'アイコンを選択',
  removeIcon: '選択解除',
  textTooLong: '入力が文字数制限を超えています',
  noAnnouncements: 'アナウンスはまだありません',
  createChannel: 'チャンネル作成',
  channelsCanBeCreated: 'チャンネルは5つまで作れます',
  deleteChannel: 'チャンネルの削除',
  deleteChannelDescription: 'チャンネル「{name}」を削除します。この操作は元に戻せません。',
  deleteChannelUnderstand: '問題ありません',
  deleteChannelConfirmation: 'チャンネルを削除します。よろしいですか？',
} satisfies Translation;

export default ja;
