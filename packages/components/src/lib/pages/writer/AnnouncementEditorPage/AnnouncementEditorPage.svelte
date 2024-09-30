<script lang="ts" context="module">
  export type Announcement = {
    headerImage?: string | undefined;
    title?: string | undefined;
    body: string;
    images?: string[] | undefined;
    updatedAt: Date;
    createdAt: Date;
  };
</script>

<script lang="ts">
  import { pushState } from '$app/navigation';
  import { page } from '$app/stores';
  import { LL } from '$lib/i18n';
  import AnnouncementEditor from '$lib/parts/AnnouncementEditor/AnnouncementEditor.svelte';
  import AnnouncementView from '$lib/parts/AnnouncementView/AnnouncementView.svelte';
  import { toStyle } from '$lib/utils/toStyle';

  export let announcement: Announcement | undefined = undefined;
  export let backURL: string;
  export let onPostClick: ((announcement: Announcement) => void) | undefined = undefined;

  $: previewData = $page.state.announcementEditorPagePreview;
</script>

<div class="container">
  <header>
    <a class="back" href={previewData ? location.pathname : backURL}>{$LL.back()}</a>
  </header>

  <hr />

  {#if previewData?.announcement}
    <AnnouncementView announcement={previewData.announcement} />
    <hr />
    <button
      class="post-btn"
      on:click={() => {
        if (onPostClick) {
          onPostClick(previewData.announcement);
        }
      }}>{$LL.postAnnouncement()}</button
    >
  {/if}

  <div style={toStyle({ display: previewData ? 'none' : undefined })}>
    <AnnouncementEditor
      {announcement}
      on:preview={(event) => {
        const announcement = event.detail;
        pushState('', {
          ...$page.state,
          announcementEditorPagePreview: {
            announcement,
          },
          fromHref: location.href,
        });
      }}
    />
  </div>
</div>

<style lang="scss">
  .container {
    max-width: 600px;
    margin: 0 auto 100px;
    padding: 8px;
  }

  header {
    a {
      padding: 8px;
      display: inline-block;
    }
  }
  hr {
    margin: 0 0 20px;
  }
  .post-btn {
    display: block;
    margin: 0 auto;
  }
</style>
