<script lang="ts" context="module">
  import '$lib/ChannelPage.svelte';

  import { Story } from '@storybook/addon-svelte-csf';
  import type { Meta } from '@storybook/svelte';

  import ChannelEditor from '$lib/ChannelEditor.svelte';

  export const meta = {
    title: 'ChannelEditor',
    tags: ['autodocs'],
  } satisfies Meta;
</script>

<Story name="Create">
  <ChannelEditor
    on:dismiss={() => {
      console.log('dismiss');
    }}
    on:submit={(event) => {
      console.log(event.detail);
    }}
  />
</Story>
