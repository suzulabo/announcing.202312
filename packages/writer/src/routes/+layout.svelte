<script lang="ts">
  import NavigationSupport from '@announcing/components/NavigationSupport.svelte';
  import { LL } from '@announcing/i18n';

  import type { LayoutServerData } from './$types';

  export let data: LayoutServerData;

  $: siteNameElementAttrs = data.userID ? { this: 'a', href: '/' } : { this: 'div' };
</script>

<div class="container">
  <header>
    <svelte:element this={siteNameElementAttrs.this} {...siteNameElementAttrs}>
      <span class="site-name">Announcing</span>
      <span class="sub-title">{$LL.writer.subTitle()}</span>
    </svelte:element>
  </header>
  <hr />
  <slot />
</div>

<NavigationSupport />

<style lang="scss">
  .container {
    max-width: 800px;
    margin: 0 auto;

    header {
      padding: 8px;

      .site-name {
        font-size: 20px;
      }
      .sub-title {
        background-color: var(--color-background-light);
        padding: 4px;
        border-radius: 4px;
        font-size: 14px;
      }
    }
  }
</style>
