<script lang="ts">
  interface Props {
    show?: boolean;
  }

  let { show = false }: Props = $props();
</script>

{#if show}
  <div class="container">
    <div class="bar"></div>
  </div>
{/if}

<style lang="scss">
  .container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    z-index: 9999;
    .bar {
      width: 50%;
      height: 100%;
      background-color: var(--color-accent);
      animation: progress 5s infinite ease-in;

      @keyframes progress {
        0%,
        10% {
          width: 0;
        }
        100% {
          width: 100%;
        }
      }
    }
  }
</style>
