<script lang="ts" context="module">
  import '$lib/ChannelPage.svelte';

  import { Story } from '@storybook/addon-svelte-csf';
  import type { Meta } from '@storybook/svelte';

  import type { ChannelPageParams } from '$lib/ChannelPage';

  import { params } from './ChannelPage';

  export const meta = {
    title: 'ChannelPage/default',
    tags: ['autodocs'],
  } satisfies Meta;

  const noAnnouncementsParams = (): ChannelPageParams => {
    return { ...params, segments: [] };
  };
</script>

<Story name="Basic">
  <channel-page {params} />
</Story>

<Story name="No announcements">
  <channel-page params={noAnnouncementsParams()} />
</Story>
