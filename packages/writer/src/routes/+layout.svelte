<script lang="ts">
  import { MaterialSymbolsHomeOutlineRounded } from '@announcing/components/icons';
  import RootLayout from '@announcing/components/RootLayout.svelte';
  import Toolbar from '@announcing/components/Toolbar.svelte';
  import { type Snippet } from 'svelte';
  import type { LayoutData } from './$types';
  import { LL } from '@announcing/i18n';

  interface Props {
    data: LayoutData;
    children?: Snippet;
  }

  let { data, children }: Props = $props();
</script>

<svelte:head>
  <title>Announcing Writer</title>
</svelte:head>

<RootLayout>
  {@render children?.()}
</RootLayout>

<Toolbar
  requestLocale={data.requestLocale}
  requestTheme={data.requestTheme}
  items={[
    { type: 'link', label: $LL.home(), icon: MaterialSymbolsHomeOutlineRounded, href: '/' },
    { type: 'settings' },
  ]}
/>
