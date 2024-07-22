<script lang="ts">
  import linkifyHtml from 'linkify-html';

  import type { ChannelViewParams } from '../types';

  export let params: ChannelViewParams;

  $: ({ channel, noAnnouncements, msgs } = params);

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
      <img class="icon" src={channel.icon} alt={channel.title} />
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
  <hr />
  {#if noAnnouncements}
    <div class="no-announcements">
      {msgs.noAnnouncements}
    </div>
  {:else}
    <slot />
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

    .no-announcements {
      text-align: center;
    }
  }
</style>
