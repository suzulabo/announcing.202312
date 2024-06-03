import type { Msgs } from './types';

const msgs: Msgs = {
  signIn: 'Sign in with {{placeholder}}',
  signOut: 'Sign out',
  back: 'Back',
  cancel: 'Cancel',
  maxLength: 'Enter up to {{num}} characters',
  maxLengthOptional: 'Enter up to {{num}} characters(Optional)',
  createAnnouncement: 'Create a new announcement',
  create: {
    title: 'Creating a new announcement',
    input: {
      title: 'Title',
      addIcon: 'Select icon',
      delIcon: 'Remove icon',
      desc: 'Description',
      submit: 'Create',
      submitUpdate: 'Update',
    },
  },
  thread: {
    edit: 'Edit',
    newPost: 'New post',
  },
};

export default msgs;
