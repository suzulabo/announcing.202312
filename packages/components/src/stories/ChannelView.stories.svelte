<script lang="ts" context="module">
  import { Story } from '@storybook/addon-svelte-csf';
  import type { Meta } from '@storybook/svelte';

  import { loadChannelViewComponents } from '$lib/ChannelView/loader';
  import Loading from '$lib/Loading.svelte';

  import { announcements, channel } from './ChannelView';

  export const meta = {
    title: 'ChannelView/default',
    tags: ['autodocs'],
  } satisfies Meta;
</script>

<Story name="Basic">
  {#await loadChannelViewComponents()}
    <Loading show={true} />
  {:then { ChannelView, AnnouncementView }}
    <ChannelView {channel}>
      {#each announcements as announcement}
        <AnnouncementView {announcement} />
      {/each}
    </ChannelView>
  {/await}
</Story>
