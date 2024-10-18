<script lang="ts">
  import { LL } from '@announcing/i18n';
</script>

<div class="container">
  <button>{$LL.createChannel()}</button>
  <button disabled>{$LL.createChannel()}</button>
</div>

<style lang="scss">
  .container {
    display: flex;
    gap: 16px;
    width: fit-content;
    margin: 30vh auto;
  }
</style>
