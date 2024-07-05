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
      delete: 'Delete',
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
    delete: {
      title: 'Delete channel',
      desc: 'Delete channel. This operation cannot be undone.',
      input: {
        submit: 'Delete',
      },
    },
    announcement: {
      write: {
        title: {
          new: 'Write new announcement',
          edit: 'Edit this announcement',
        },
        input: {
          delete: 'Delete',
          headerImage: {
            select: 'Select header image',
            remove: 'Remove header image',
          },
          title: 'Title',
          body: 'Body',
          images: {
            select: 'Add images',
          },
          submit: { new: 'Post', edit: 'Update' },
        },
      },
    },
  },
};
