<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import makeStyle from './makeStyle.js';

  export let src: string | File | undefined = undefined;
  export let alt = '';
  export let styles: { width?: string; height?: string; borderRadius?: string } | undefined =
    undefined;

  let imgSrc: string;

  $: {
    if (src) {
      if (src instanceof File) {
        const reader = new FileReader();

        reader.onload = (event) => {
          imgSrc = event.target?.result as string;
        };

        reader.readAsDataURL(src);
      } else {
        imgSrc = src;
      }
    }
  }

  const clickDispatch = createEventDispatcher();
  const handleClick = () => {
    clickDispatch('click');
  };
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<img src={imgSrc} {alt} on:click={handleClick} style={makeStyle(styles)} />

<style lang="scss">
  img {
    width: var(--width, auto);
    height: var(--height, auto);
    border-radius: var(--borderRadius, 8px);
    border: 1px solid var(--color-border);
    object-fit: contain;
    cursor: pointer;
  }
</style>
