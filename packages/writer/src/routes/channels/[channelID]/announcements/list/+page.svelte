<script lang="ts">
  import ChannelView from '@announcing/components/ChannelView.svelte';

  import { page } from '$app/state';
  import { fetchAnnouncement } from '$lib/fetch/fetchAnnouncement';

  import { createSnapshotContext } from '@announcing/components/snapshotContext';
  import { LL } from '@announcing/i18n';
  import type { PageData } from './$types';
  import type { ComponentProps } from 'svelte';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  export const snapshot = createSnapshotContext();

  let channelViewProps = $derived<ComponentProps<typeof ChannelView>>({
    announcementHrefPrefix: page.url.pathname,
    announcementKeys: data.channel.announcementIDs ?? [],
    announcementLoader: (key: string) => {
      return fetchAnnouncement({
        channelID: page.params['channelID'] as string,
        announcementID: key,
      });
    },
  });
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
    margin-bottom: 16px;
    .prompt {
      margin: auto;
    }
  }
</style>
