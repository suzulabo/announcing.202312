<!-- https://codepen.io/adrianmg/pen/Omedpo -->
<script lang="ts"></script>

<div class="spinner">
  <div></div>
  <div></div>
  <div></div>
</div>

<style lang="scss">
  .spinner {
    animation: showdelay 2s;

    @keyframes showdelay {
      0%,
      50% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }

    & > div {
      width: 12px;
      height: 12px;
      background-color: var(--color-text);
      border-radius: 100%;
      display: inline-block;
      animation: bouncedelay 1.3s infinite ease-in-out both;
    }
    & > div:nth-child(1) {
      animation-delay: 1s;
    }
    & > div:nth-child(2) {
      animation-delay: 1.16s;
      margin: 0 8px;
    }
    & > div:nth-child(3) {
      animation-delay: 1.32s;
    }
    @keyframes bouncedelay {
      0%,
      80%,
      100% {
        opacity: 0.1;
      }
      40% {
        opacity: 1;
      }
    }
  }
</style>
