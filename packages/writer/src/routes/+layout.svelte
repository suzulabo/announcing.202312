<script lang="ts">
  import NavigationSupport from '@announcing/components/NavigationSupport.svelte';
</script>

<div class="container">
  <slot />
</div>

<NavigationSupport />

<style lang="scss">
  .container {
    max-width: 800px;
    margin: 0 auto;
  }
</style>
