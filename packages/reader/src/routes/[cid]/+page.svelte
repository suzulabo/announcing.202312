<script lang="ts">
  import { format } from 'date-fns';
  import linkifyHtml from 'linkify-html';

  import type { PageData } from './$types';

  export let data: PageData;

  $: channel = data.channel;

  const formatDate = (n: number) => {
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

<div class="main">
  <div class="name-line">
    <div class="name">
      {channel.title}
    </div>
    {#if channel.icon}
      <img class="icon" src={`/s/${channel.icon}`} alt={channel.title} />
    {/if}
  </div>
  {#if channel.desc}
    <div class="desc">
      {@html toHtml(channel.desc)}
    </div>
  {/if}
  {#if channel.links}
    {#each channel.links as link}
      <div class="link">
        <a href={link.url}>{link.name}</a>
      </div>
    {/each}
  {/if}

  {#if channel.announcements}
    <hr />
    {#each channel.announcements as announcement}
      <div class="post">
        <div class="published">{formatDate(announcement.updatedAt)}</div>
        {#if announcement.title}
          <div class="title">{announcement.title}</div>
        {/if}
        {#if announcement.body}
          <div class="body">{@html toHtml(announcement.body)}</div>
        {/if}
      </div>
      <hr />
    {/each}
  {/if}
</div>

<style lang="scss">
  .main {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px 10px;

    .name-line {
      display: flex;
      align-items: center;
      .name {
        font-weight: bold;
        font-size: 24px;
        flex-grow: 1;
      }
      .icon {
        width: 64px;
        height: 64px;
        border-radius: 8px;
        object-fit: contain;
      }
    }

    .desc {
      margin: 10px 5px 0;
      white-space: pre-line;
    }

    .link {
      margin: 10px 5px 0;
    }

    hr {
      margin: 20px 0;
    }

    .post {
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
  }
</style>
