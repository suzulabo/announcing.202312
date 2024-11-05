<script lang="ts">
  import ChannelView, { type ChannelViewParams } from '@announcing/components/ChannelView.svelte';

  import { page } from '$app/stores';
  import { fetchAnnouncement } from '$lib/fetch/fetchAnnouncement';

  import type { PageData } from './$types';
  import { setupBack } from '@announcing/components/actions/back';
  import { LL } from '@announcing/i18n';
  import { createSnapshotContext } from '@announcing/components/utils';

  export let data: PageData;

  export const snapshot = createSnapshotContext();

  const back = setupBack();

  $: params = {
    channel: data.channel,
    announcementHrefPrefix: $page.url.pathname,
    announcementKeys: data.channel.announcementIDs ?? [],
    announcementLoader: (key: string) => {
      return fetchAnnouncement({
        channelID: $page.params['channelID'] as string,
        announcementID: key,
      });
    },
  } satisfies ChannelViewParams;
</script>

<div class="menu">
  <a class="back" href={`${$page.url.href.replace('/announcements/list', '')}`} use:back
    >{$LL.back()}</a
  >
  <div class="prompt info">{$LL.announcementListPrompt()}</div>
</div>
<ChannelView {params} />

<style lang="scss">
  .menu {
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 16px 8px;
    border-bottom: 1px solid var(--color-border-light);
    margin-bottom: 16px;
    .prompt {
      margin-left: auto;
    }
  }
</style>
