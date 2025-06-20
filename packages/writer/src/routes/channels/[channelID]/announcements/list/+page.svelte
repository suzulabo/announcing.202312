<script lang="ts">
  import ChannelView from '@announcing/components/ChannelView.svelte';

  import { page } from '$app/state';
  import { fetchAnnouncement } from '$lib/fetch/fetchAnnouncement';

  import { createSnapshotContext } from '@announcing/components/snapshotContext';
  import { LL } from '@announcing/i18n';
  import type { PageData } from './$types';
  import type { ComponentProps } from 'svelte';
  import { back } from '@announcing/components/actions/back';

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

<div class="back-box">
  <a class="button small back" href={data.backHref} use:back>{$LL.back()}</a>
</div>

<style lang="scss">
  .menu {
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 0 8px;
    margin-bottom: 16px;
    .prompt {
      margin: auto;
    }
  }

  .back-box {
    position: sticky;
    bottom: 32px;
    margin: 32px auto 0;
  }
</style>
