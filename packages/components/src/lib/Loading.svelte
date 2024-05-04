<script lang="ts">
  export let show = false;
</script>

{#if show}
  <div class="loading">
    <div class="bar" />
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

    // https://codepen.io/dowding/pen/wJWpoY
    .bar {
      background: repeating-linear-gradient(
        to right,
        var(--color-background) 0%,
        var(--color-text) 50%,
        var(--color-background) 100%
      );
      width: 100%;
      height: 10px;
      background-size: 200% auto;
      background-position: 0 100%;
      animation: gradient 3s infinite;
      animation-fill-mode: forwards;
      animation-timing-function: linear;
    }

    @keyframes gradient {
      0% {
        background-position: 0 0;
      }
      100% {
        background-position: -200% 0;
      }
    }
  }
</style>
