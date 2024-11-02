<script lang="ts">
  import { setupBack } from '@announcing/components/actions/back';
  import AnnouncementView from '@announcing/components/AnnouncementView.svelte';
  import { LL } from '@announcing/i18n';
  import type { PageData } from './$types';

  export let data: PageData;

  const back = setupBack();
</script>

<div class="buttons">
  <a class="back" href="../list" use:back>{$LL.back()}</a>

  <a class="button" href={`/channels/${data.channelID}/announcements/${data.announcementID}`}
    >{$LL.edit()}</a
  >
  <button>{$LL.delete()}</button>
</div>

<AnnouncementView announcement={data.announcement} />

<style lang="scss">
  .buttons {
    display: flex;
    justify-content: center;
    gap: 8px;
    align-items: center;
    padding: 16px 8px;
    border-bottom: 1px solid var(--color-border-light);
    margin-bottom: 16px;

    .back {
      margin-right: auto;
    }
  }
</style>
