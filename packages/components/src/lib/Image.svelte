<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let src: string | File | undefined = undefined;
  export let alt = '';

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

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<img src={imgSrc} {alt} on:click={handleClick} />

<style lang="scss">
  img {
    width: var(--width, auto);
    height: var(--height, auto);
    border-radius: var(--border-radius, 8px);
    border: 1px solid var(--color-border);
    object-fit: contain;
    cursor: pointer;
  }
</style>
