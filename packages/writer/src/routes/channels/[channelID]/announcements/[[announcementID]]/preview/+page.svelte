<script lang="ts">
  import AnnouncementView from '@announcing/components/AnnouncementView.svelte';
  import { LL } from '@announcing/i18n';
  import { onMount } from 'svelte';

  import { page } from '$app/stores';

  import type { Snapshot } from '../$types';

  let previewData: App.PageState['announcementPreviewData'];

  onMount(() => {
    previewData = $page.state.announcementPreviewData;
  });

  export const snapshot: Snapshot<App.PageState['announcementPreviewData']> = {
    capture: () => {
      return previewData;
    },
    restore: (value) => {
      const stateData = $page.state.announcementPreviewData;
      if (stateData) {
        previewData = stateData;
      } else {
        previewData = value;
      }
    },
  };
</script>

{#if previewData}
  {@const { channel, announcement } = previewData}
  <div class="container">
    <div class="trail">
      <a href={`/channels/${channel.channelID}`}>{channel.name}</a>
      /
      <a href={`${$page.url.pathname.replace('/preview', '')}`}>{$LL.postAnnouncement()}</a>
      /
      {$LL.preview()}
    </div>
    <AnnouncementView {announcement} />
  </div>
{/if}

<style lang="scss">
  .container {
    padding: 4px 8px;

    .trail {
      font-size: 14px;
      margin-bottom: 16px;
    }
  }
</style>
