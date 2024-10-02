<script lang="ts">
  import { page } from '$app/stores';
  import Page from '$lib/pages/writer/channels/[channelID]/announcements/Page.svelte';

  import { genChannelViewParams } from '../../../../../_misc/genChannelViewParams';

  const params = genChannelViewParams(`${$page.url.pathname}/`);
</script>

<Page {params} />
