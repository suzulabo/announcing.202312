<script lang="ts">
  import { format } from 'date-fns';
  import linkifyHtml from 'linkify-html';

  import type { AnnouncementViewData } from '../loader';

  export let data: AnnouncementViewData;

  $: announcement = data.announcement;

  const formatDate = (n: Date) => {
    return format(n, 'yyyy-MM-dd HH:mm');
  };
  const toHtml = (s: string) => {
    return linkifyHtml(s, {
      defaultProtocol: 'https',
      target: '_blank',
      rel: 'nofollow noreferrer',
    });
  };
</script>

<div class="announcement">
  <div class="published">{formatDate(announcement.updatedAt)}</div>
  {#if announcement.title}
    <div class="title">{announcement.title}</div>
  {/if}
  {#if announcement.body}
    <div class="body">{@html toHtml(announcement.body)}</div>
  {/if}
</div>
<hr />

<style lang="scss">
  .announcement {
    padding: 0 10px;
    min-height: 100px;
    .title {
      font-size: 18px;
      font-weight: bold;
      margin: 10px 0 0;
    }
    .body {
      white-space: pre-line;
      margin: 10px 0 0;
    }
  }

  hr {
    margin: 20px 0;
  }
</style>
