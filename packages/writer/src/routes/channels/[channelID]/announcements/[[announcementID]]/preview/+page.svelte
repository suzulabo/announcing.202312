<script lang="ts" module>
  type Announcement = {
    title: string | undefined;
    body: string;
    headerImage: string | undefined;
    images: string[] | undefined;
    edit?: {
      announcementID: string;
      updatedAt: number;
      createdAt: number;
    };
  };

  export type AnnouncementPreviewData = {
    channel: { name: string; icon: string | undefined };
    announcement: Announcement;
  };

  const makeFormData = async ({ announcement }: AnnouncementPreviewData) => {
    const formData = new FormData();

    formData.append('body', announcement.body);

    if (announcement.title) {
      formData.append('title', announcement.title);
    }

    if (announcement.headerImage) {
      const headerImage = await loadBlob(announcement.headerImage);
      if (headerImage) {
        formData.append('headerImage', headerImage);
      } else {
        formData.append('headerImage', announcement.headerImage);
      }
    }

    if (announcement.images) {
      for (const v of announcement.images) {
        const image = await loadBlob(v);
        if (image) {
          formData.append('images', image);
        } else {
          formData.append('images', v);
        }
      }
    }

    if (announcement.edit?.updatedAt) {
      formData.append('targetUpdatedAt', announcement.edit.updatedAt + '');
    }

    return formData;
  };
</script>

<script lang="ts">
  import AnnouncementView from '@announcing/components/AnnouncementView.svelte';
  import Loading from '@announcing/components/Loading.svelte';
  import { loadBlob } from '@announcing/components/utils';
  import type { GetAnnouncementResult } from '@announcing/db/types';
  import { LL } from '@announcing/i18n';

  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  import type { Snapshot } from './$types';

  let loading = $state(false);
  let channelID = $derived($page.params['channelID'] as string);
  let announcementID = $derived($page.params['announcementID']);
  let previewData = $state<AnnouncementPreviewData | undefined>(
    $page.state.announcementPreviewData,
  );

  let [channel, announcement] = $derived.by(() => {
    if (!previewData) {
      return [undefined, undefined];
    }

    const now = new Date().getTime();
    if (!previewData.announcement.edit) {
      return [
        previewData.channel,
        {
          ...previewData.announcement,
          updatedAt: now,
          createdAt: now,
        } satisfies GetAnnouncementResult,
      ];
    } else {
      // Just in case
      if (announcementID !== previewData.announcement.edit.announcementID) {
        void goto('/');
        return [undefined, undefined];
      }
      return [
        previewData.channel,
        {
          ...previewData.announcement,
          updatedAt: now,
          createdAt: previewData.announcement.edit.createdAt,
        } satisfies GetAnnouncementResult,
      ];
    }
  });

  export const snapshot = {
    capture: () => {
      return previewData;
    },
    restore: (value) => {
      const stateData = $page.state.announcementPreviewData;
      if (!stateData) {
        previewData = value;
      }
    },
  } satisfies Snapshot<AnnouncementPreviewData | undefined>;

  const addAnnouncement = async () => {
    if (!previewData) {
      return;
    }

    const formData = await makeFormData(previewData);
    loading = true;
    try {
      if (announcementID) {
        await fetch(`/api/channels/${channelID}/announcements/${announcementID}`, {
          method: 'PUT',
          body: formData,
        });

        await goto(`/channels/${channelID}/announcements/list`);
      } else {
        await fetch(`/api/channels/${channelID}/announcements`, {
          method: 'POST',
          body: formData,
        });

        await goto(`/channels/${channelID}`);
      }
    } finally {
      loading = false;
    }
  };
</script>

{#if channel && announcement}
  <div class="container">
    <AnnouncementView {announcement} />
    <hr />
    <button class="submit-btn" onclick={addAnnouncement}
      >{announcementID ? $LL.updateAnnouncement() : $LL.postAnnouncement()}</button
    >
  </div>
{/if}

<Loading show={loading} />

<style lang="scss">
  .container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 8px 0 16px;

    .submit-btn {
      align-self: center;
    }
  }
</style>
