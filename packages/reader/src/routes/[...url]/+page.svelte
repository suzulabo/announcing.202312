<script lang="ts">
  import { Button } from '@announcing/components';
  import type { PageData } from './$types';
  import { t } from '$lib/translations';
  import { format, parseISO } from 'date-fns';
  import linkifyHtml from 'linkify-html';

  export let data: PageData;

  const formatDate = (s: string) => {
    const d = parseISO(s);
    return format(d, 'yyyy-MM-dd HH:mm');
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
  {#if data.error}
    {#if data.error === 'RESPONSE'}
      RESPONSE ERROR
    {/if}
    {#if data.error === 'JSON'}
      JSON ERROR
    {/if}
  {/if}

  {#if data.json}
    {@const { info, posts } = data.json}
    <div class="name-line">
      <div class="name">
        {info.name}
      </div>
      {#if info.icon}
        <img class="icon" src={info.icon} alt={info.name} />
      {/if}
    </div>
    {#if info.desc}
      <div class="desc">
        {@html toHtml(info.desc)}
      </div>
    {/if}
    {#if info.link}
      <div class="link">
        {@html toHtml(info.link)}
      </div>
    {/if}

    <div class="buttons">
      <Button --width="100%">{$t('follow')}</Button>
      <Button --width="100%">{$t('getNotifications')}</Button>
    </div>
    <hr />
    {#each posts as post}
      <div class="post">
        <div class="published">{formatDate(post.published)}</div>
        {#if post.title}
          <div class="title">{post.title}</div>
        {/if}
        {#if post.body}
          <div class="body">{@html toHtml(post.body)}</div>
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

    .buttons {
      margin-top: 20px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
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
