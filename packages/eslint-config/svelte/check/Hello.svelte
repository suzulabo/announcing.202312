<script lang="ts">
  export let prefix = '';

  export let suffix = 'World';

  console.log('Hello');

  console.log('World');
</script>

<div>
  {prefix} Hello {suffix}
</div>

<style>
  div {
    background-color: red;
    color: white;
  }
</style>
