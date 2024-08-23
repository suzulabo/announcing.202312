<script lang="ts">
  import type { Announcement } from '$lib/ChannelPage/types';

  export let announcement: Announcement;
</script>

<div>
  {announcement.body}
</div>
