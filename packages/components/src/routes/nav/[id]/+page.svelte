<script lang="ts">
  import { page } from '$app/stores';

  $: cur = +($page.params['id'] ?? '0');
</script>

<div class="container">
  <a href={`/back/${cur - 1}`}>prev</a>
  <span>{cur}</span>
  <a href={`/back/${cur + 1}`}>next</a>
</div>

<style lang="scss">
  .container {
    margin: 30vh auto;
    width: fit-content;
    font-size: 24px;
  }
</style>
