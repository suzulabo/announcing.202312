<script lang="ts">
  import F7SquareFavorites from '$lib/components/icon/F7SquareFavorites.svelte';
  import MdiReload from '$lib/components/icon/MdiReload.svelte';
  import { isPWA } from '$lib/platform/platform';
  import RootLayout from '@announcing/components/RootLayout.svelte';
  import Toolbar from '@announcing/components/Toolbar.svelte';
  import { LL } from '@announcing/i18n';
  import { onMount, type ComponentProps, type Snippet } from 'svelte';
  import type { LayoutData } from './$types';

  interface Props {
    data: LayoutData;
    children?: Snippet;
  }

  let { data, children }: Props = $props();
  let pwa = $state(false);
  let toolbarItems = $derived.by(() => {
    const items: ComponentProps<typeof Toolbar>['items'] = [];
    if (!pwa) {
      items.push({
        type: 'link',
        label: $LL.favorites(),
        icon: F7SquareFavorites,
        href: '/favorites',
      });
    }
    items.push(
      {
        type: 'button',
        label: $LL.reload(),
        icon: MdiReload,
        onclick: () => {
          location.reload();
        },
      },
      { type: 'settings' },
    );
    return items;
  });

  onMount(() => {
    pwa = isPWA();
  });
</script>

<RootLayout>
  {@render children?.()}
</RootLayout>

<Toolbar requestLocale={data.requestLocale} requestTheme={data.requestTheme} items={toolbarItems} />
