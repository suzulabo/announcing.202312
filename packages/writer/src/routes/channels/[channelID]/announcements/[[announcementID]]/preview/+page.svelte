<script lang="ts" context="module">
  const makeFormData = async (announcement: GetAnnouncementResult) => {
    const formData = new FormData();

    formData.append('body', announcement.body);
    if (announcement.title) {
      formData.append('title', announcement.title);
    }

    if (announcement.headerImage) {
      const headerImage = await loadBlob(announcement.headerImage);
      if (headerImage) {
        formData.append('headerImage', headerImage);
      }
    } else {
      formData.append('headerImage', 'remove');
    }

    if (announcement.images) {
      for (const v of announcement.images) {
        const image = await loadBlob(v);
        if (image) {
          formData.append('images', image);
        } else {
          // TODO
          formData.append('images', 'keep');
        }
      }
    } else {
      formData.append('images', 'remove');
    }

    return formData;
  };
</script>

<script lang="ts">
  import AnnouncementView from '@announcing/components/AnnouncementView.svelte';
  import Loading from '@announcing/components/Loading.svelte';
  import { gotoPage } from '@announcing/components/NavigationSupport.svelte';
  import { loadBlob } from '@announcing/components/utils/idbBlob';
  import type { GetAnnouncementResult } from '@announcing/db/types';
  import { LL } from '@announcing/i18n';
  import { onMount } from 'svelte';

  import { page } from '$app/stores';

  import type { Snapshot } from '../$types';

  let previewData: App.PageState['announcementPreviewData'];
  let loading = false;

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

  const addAnnouncement = async () => {
    if (!previewData?.announcement) {
      return;
    }

    const formData = await makeFormData(previewData.announcement);
    loading = true;
    try {
      await fetch(`/api/channels/${previewData.channel.channelID}/announcements`, {
        method: 'POST',
        body: formData,
      });

      await gotoPage(`/channels/${previewData.channel.channelID}`);
    } finally {
      loading = false;
    }
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
    <div class="submit-box">
      <button on:click={addAnnouncement}>{$LL.postAnnouncement()}</button>
      <hr />
    </div>
    <AnnouncementView {announcement} />
  </div>
{/if}

<Loading show={loading} />

<style lang="scss">
  .container {
    padding: 4px 8px;

    .trail {
      font-size: 14px;
    }
  }
  .submit-box {
    position: sticky;
    top: 0;
    padding: 16px 8px 4px;
    text-align: center;
    background-color: var(--color-background);

    hr {
      margin: 8px 0;
    }
  }
</style>
