<script lang="ts" context="module">
  import '$lib/ChannelPage.svelte';

  import { Story } from '@storybook/addon-svelte-csf';
  import type { Meta } from '@storybook/svelte';

  import { params } from './ChannelPage';

  export const meta = {
    title: 'ChannelPage/default',
    tags: ['autodocs'],
    parameters: {
      layout: 'fullscreen',
    },
  } satisfies Meta;
</script>

<Story name="Basic">
  <channel-page {params} />
</Story>

<Story name="No announcements">
  <channel-page params={{ ...params, segments: [] }} />
</Story>

<Story name="Dark">
  <channel-page params={{ ...params, viewName: 'default_dark' }} />
</Story>

<Story name="Light">
  <channel-page params={{ ...params, viewName: 'default_light' }} />
</Story>
