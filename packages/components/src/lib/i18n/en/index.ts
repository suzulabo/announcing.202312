import type { BaseTranslation } from '../i18n-types';

const en = {
  edit: 'Edit',
  delete: 'Delete',
  cancel: 'Cancel',
  back: 'Back',
  preview: 'Preview',
  settings: 'Settings',
  required: '(Required)',
  title: 'Title',
  desc: 'Description',
  selectIcon: 'Select icon',
  removeIcon: 'Remove',
  textTooLong: 'Your input exceeds the character limit.',
  noAnnouncements: 'No announcements yet.',
  createChannel: 'Create Channel',
  channelsCanBeCreated: 'Up to five channels can be created.',
  deleteChannel: 'Delete Channel',
  deleteChannelDescription:
    'You are about to delete the channel "{name}". This action cannot be undone.',
  deleteChannelUnderstand: 'I understand.',
  deleteChannelConfirmation: 'Are you sure you want to delete the channel?',
} satisfies BaseTranslation;

export default en;
