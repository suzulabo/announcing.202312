<script lang="ts">
  import ChannelView, { type ChannelViewProps } from '@announcing/components/ChannelView.svelte';

  import { page } from '$app/stores';
  import { fetchAnnouncement } from '$lib/fetch/fetchAnnouncement';

  import { createSnapshotContext } from '@announcing/components/utils';
  import { LL } from '@announcing/i18n';
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  export const snapshot = createSnapshotContext();

  let channelViewProps = $derived({
    channel: data.channel,
    announcementHrefPrefix: $page.url.pathname,
    announcementKeys: data.channel.announcementIDs ?? [],
    announcementLoader: (key: string) => {
      return fetchAnnouncement({
        channelID: $page.params['channelID'] as string,
        announcementID: key,
      });
    },
  } satisfies ChannelViewProps);
</script>

<div class="menu">
  <div class="prompt info">{$LL.announcementListPrompt()}</div>
</div>
<ChannelView {...channelViewProps} />

<style lang="scss">
  .menu {
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 16px 8px;
    border-bottom: 1px solid var(--color-border-light);
    margin-bottom: 16px;
    .prompt {
      margin: auto;
    }
  }
</style>
