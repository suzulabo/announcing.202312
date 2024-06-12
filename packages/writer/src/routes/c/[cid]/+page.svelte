<script lang="ts">
  import { page } from '$app/stores';
  import { setupBack } from '$lib/actions/back';
  import { t } from '$lib/i18n/translations';
  import linkifyHtml from 'linkify-html';
  import SuperDebug from 'sveltekit-superforms';
  import type { PageData } from './$types';

  export let data: PageData;

  $: channel = data.channel;

  const toHtml = (s: string) => {
    return linkifyHtml(s, {
      defaultProtocol: 'https',
      target: '_blank',
      rel: 'nofollow noreferrer',
    });
  };

  const back = setupBack($page.state.fromPage);
</script>

<div class="container">
  <div class="head">
    <div class="title">
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
  <a class="button edit" href={`/c/${$page.params.cid}/w`}>{$t('channel.edit')}</a>
  <a href="/" use:back>{$t('back')}</a>
  <hr />
  <a class="button add-post" href={`/c/${$page.params.cid}/a/new`}>{$t('channel.newPost')}</a>
</div>
<SuperDebug {data} />

<style lang="scss">
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px 10px;
    display: flex;
    flex-direction: column;

    .head {
      display: flex;
      align-items: center;
      .title {
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

    a {
      margin: 20px auto 0;
    }

    hr {
      margin: 20px 0 0;
    }
  }
</style>
