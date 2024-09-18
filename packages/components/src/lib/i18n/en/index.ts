import type { BaseTranslation } from '../i18n-types';

const en = {
  edit: 'Edit',
  delete: 'Delete',
  cancel: 'Cancel',
  back: 'Back',
  preview: 'Preview',
  settings: 'Settings',
  required: '(Required)',
  channelName: 'Channel name',
  title: 'Title',
  desc: 'Description',
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
} satisfies BaseTranslation;

export default en;
