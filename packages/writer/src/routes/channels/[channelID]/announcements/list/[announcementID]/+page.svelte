<script lang="ts">
  import AnnouncementView from '@announcing/components/AnnouncementView.svelte';
  import { LL } from '@announcing/i18n';
  import type { PageData } from './$types';


  import { goto } from '$app/navigation';
  import DeleteModal from './DeleteModal.svelte';
  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let deleteModal: DeleteModal = $state();

  const deleteAnnouncement = async () => {
    await fetch(`/api/channels/${data.channelID}/announcements/${data.announcementID}`, {
      method: 'DELETE',
      body: JSON.stringify({ updatedAt: data.announcement.updatedAt }),
    });

    await goto('../list');
  };
</script>

<div class="buttons">
  <a class="button" href={`/channels/${data.channelID}/announcements/${data.announcementID}`}
    >{$LL.edit()}</a
  >
  <button
    onclick={() => {
      deleteModal.openModal();
    }}>{$LL.delete()}</button
  >
</div>

<AnnouncementView announcement={data.announcement} />

<DeleteModal bind:this={deleteModal} onSubmit={deleteAnnouncement} />

<style lang="scss">
  .buttons {
    display: flex;
    justify-content: center;
    gap: 24px;
    align-items: center;
    padding: 16px 8px;
    border-bottom: 1px solid var(--color-border-light);
    margin-bottom: 16px;
  }
</style>
