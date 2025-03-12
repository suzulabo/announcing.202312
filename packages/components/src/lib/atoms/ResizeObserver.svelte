<script lang='ts'>
  import type { Snippet } from 'svelte'
  import { createResizeObserverHelper } from '$lib/utils/resizeObserverHelper'
  import { onMount } from 'svelte'

  interface Props {
    onResize: (params: { el: Element }) => void
    children?: Snippet
  }

  const { onResize, children }: Props = $props()

  let wrapper: HTMLDivElement

  const observerCallback = (entry: ResizeObserverEntry) => {
    const el = entry.target
    onResize({ el })
  }

  onMount(() => {
    const resizeHelper = createResizeObserverHelper(observerCallback)

    for (const el of wrapper.children) {
      resizeHelper.observe(el)
    }

    return () => {
      resizeHelper.disconnect()
    }
  })
</script>

<div bind:this={wrapper}>{@render children?.()}</div>

<style lang='scss'>
  div {
    display: contents;
  }
</style>
