<script lang="ts" context="module">
  import '$lib/ChannelPage.svelte';

  import { Story } from '@storybook/addon-svelte-csf';
  import type { Meta } from '@storybook/svelte';

  import ChannelEditor from '$lib/ChannelEditor.svelte';

  export const meta = {
    title: 'ChannelEditor',
    tags: ['autodocs', 'wait-.main'],
  } satisfies Meta;
</script>

<Story name="Basic">
  <ChannelEditor channel={{ icon: null, title: '', desc: '' }} params={{ backUrl: '/' }} />
</Story>
