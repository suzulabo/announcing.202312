<script lang="ts">
  import linkifyHtml from 'linkify-html';
  import SuperDebug from 'sveltekit-superforms';
  import type { PageServerData } from './$types';

  export let data: PageServerData;

  $: thread = data.thread;

  const toHtml = (s: string) => {
    return linkifyHtml(s, {
      defaultProtocol: 'https',
      target: '_blank',
      rel: 'nofollow noreferrer',
    });
  };
</script>

<div class="container">
  <div class="head">
    <div class="title">
      {thread.title}
    </div>
    {#if thread.icon}
      <img class="icon" src={`/s/${thread.icon}`} alt={thread.title} />
    {/if}
  </div>
  {#if thread.desc}
    <div class="desc">
      {@html toHtml(thread.desc)}
    </div>
  {/if}
</div>
<hr />
<SuperDebug {data} />

<style lang="scss">
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px 10px;

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
  }
</style>
