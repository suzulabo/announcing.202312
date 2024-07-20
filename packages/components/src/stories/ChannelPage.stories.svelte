<script lang="ts" context="module">
  import { Story } from '@storybook/addon-svelte-csf';
  import type { Meta } from '@storybook/svelte';

  import ChannelPage from '$lib/ChannelPage.svelte';

  import { channel } from './ChannelPage';

  export const meta = {
    title: 'ChannelPage/default',
    tags: ['autodocs'],
  } satisfies Meta;
</script>

<Story name="Basic">
  <ChannelPage {channel} />
</Story>
