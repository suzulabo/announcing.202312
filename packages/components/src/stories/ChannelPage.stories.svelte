<script lang="ts" context="module">
  import { Story } from '@storybook/addon-svelte-csf';
  import type { Meta } from '@storybook/svelte';

  import type { ChannelPageParams } from '$lib/ChannelPage';
  import ChannelPage from '$lib/ChannelPage.svelte';

  import { params } from './ChannelPage';

  export const meta = {
    title: 'ChannelPage/default',
    tags: ['autodocs'],
  } satisfies Meta;

  const noAnnouncementsParams = (): ChannelPageParams => {
    return { ...params, keys: [] };
  };
</script>

<Story name="Basic">
  <ChannelPage {params} />
</Story>

<Story name="No announcements">
  <ChannelPage params={noAnnouncementsParams()} />
</Story>
