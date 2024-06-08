import type { Msgs } from './types';

export const msgs: Msgs = {
  signIn: 'Sign in with {{placeholder}}',
  signOut: 'Sign out',
  back: 'Back',
  cancel: 'Cancel',
  maxLength: 'Enter up to {{num}} characters',
  maxLengthOptional: 'Enter up to {{num}} characters(Optional)',
  top: {
    createChannel: 'Create a new channel',
  },
  channel: {
    edit: 'Edit',
    newPost: 'Write new announcement',
    write: {
      title: {
        new: 'Create new channel',
        edit: 'Edit the channel',
      },
      input: {
        title: 'Title',
        icon: {
          select: 'Add icon',
          remove: 'Remove icon',
        },
        desc: 'Description',
        submit: { new: 'Create', edit: 'Edit' },
      },
    },
    announcement: {
      write: {
        title: {
          new: 'Write new announcement',
          edit: 'Edit this announcement',
        },
        input: {
          title: 'Title',
          body: 'Body',
          submit: { new: 'Post', edit: 'Update' },
        },
      },
    },
  },
};
