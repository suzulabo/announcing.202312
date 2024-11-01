<script lang="ts">
  import { LL } from '@announcing/i18n';
</script>

<div class="container">
  <button>{$LL.createChannel()}</button>
  <button disabled>{$LL.createChannel()}</button>
  <button class="text">{$LL.createChannel()}</button>
  <button class="text" disabled>{$LL.createChannel()}</button>
  <button class="filled">{$LL.createChannel()}</button>
  <button class="filled" disabled>{$LL.createChannel()}</button>
  <a class="button" href="https://github.com">Go to Github</a>
</div>

<style lang="scss">
  .container {
    display: grid;
    grid-template-columns: auto auto;
    gap: 16px;
    max-width: 600px;
    width: fit-content;
    margin: 30vh auto;
    button,
    a {
      margin: auto;
    }
  }
</style>
