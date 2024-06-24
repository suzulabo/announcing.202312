<script lang="ts">
  import Spinner from './Spinner.svelte';

  export let show = false;
</script>

{#if show}
  <div class="loading">
    <Spinner />
  </div>
{/if}

<style lang="scss">
  .loading {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
    background-color: var(--color-background-loading);
    z-index: var(--z-index, 999);
    cursor: wait;
    animation: showdelay 2s;
    display: flex;
    align-items: center;
    justify-content: center;

    @keyframes showdelay {
      0%,
      25% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }
  }
</style>
