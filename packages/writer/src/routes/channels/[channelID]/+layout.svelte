<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { LayoutData } from './$types';

  interface Props {
    data: LayoutData;
    children?: Snippet;
  }

  let { data, children }: Props = $props();

  let { channel } = $derived(data);
</script>

<div class="channel-box">
  <span class="name">{channel.name}</span>
  {#if channel.icon}
    <img class="icon" alt="channel icon" src={channel.icon} />
  {/if}
</div>
{@render children?.()}

<style lang="scss">
  .channel-box {
    display: flex;
    align-items: center;
    gap: 16px;
    min-height: 64px;
    padding: 0 8px 16px;
    margin-bottom: 16px;
    border-bottom: 1px solid var(--color-border-light);

    .name {
      font-size: 20px;
    }
    .icon {
      width: 64px;
      height: 64px;
      margin: 0 0 0 auto;
      border-radius: 8px;
      object-fit: contain;
    }
  }
</style>
