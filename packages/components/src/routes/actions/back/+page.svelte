<script lang="ts">
  import { setupBack } from '$lib/actions/back';

  const back = setupBack();
</script>

<div class="container">
  <a href="/" use:back>BACK</a>
</div>

<style lang="scss">
  .container {
    display: flex;
    height: 80vh;
    a {
      margin: auto;
    }
  }
</style>
