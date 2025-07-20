<script lang="ts">
  import { navigating } from '$app/state';
  import { setupBack } from '$lib/actions/back';
  import Navigating from '$lib/atoms/Navigating.svelte';
  import Toolbar from '$lib/parts/Toolbar/Toolbar.svelte';
  import MaterialSymbolsHomeOutlineRounded from '$lib/icons/MaterialSymbolsHomeOutlineRounded.svelte';
  import type { LayoutData } from './$types';

  interface Props {
    data: LayoutData;
    children?: import('svelte').Snippet;
  }

  let { data, children }: Props = $props();

  setupBack();
</script>

<Navigating show={!!navigating.from} />

{@render children?.()}

<Toolbar
  requestLocale={data.requestLocale}
  requestTheme={data.requestTheme}
  items={[
    { type: 'link', label: 'Home', href: '/', icon: MaterialSymbolsHomeOutlineRounded },
    { type: 'settings' },
  ]}
/>
