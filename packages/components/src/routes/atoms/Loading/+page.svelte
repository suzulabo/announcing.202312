<script lang="ts">
  import Loading from '$lib/atoms/Loading.svelte';

  let show = false;
</script>

<div class="container">
  <button
    on:click={(event) => {
      show = true;
      event.stopPropagation();
    }}>Show</button
  >
</div>

<Loading {show} />

<svelte:body
  on:click={() => {
    show = false;
  }}
/>

<style lang="scss">
  .container {
    text-align: center;
    padding: 30vh 16px;
  }
</style>
