<script lang='ts'>
  import Radio from '$lib/atoms/Radio.svelte'

  let value = $state('cat')
</script>

<div class='container'>
  <Radio bind:value selectedValue='cat'>Cat</Radio>
  <Radio bind:value selectedValue='dog'>Dog</Radio>
  <Radio bind:value selectedValue='bird'>Bird</Radio>
  <Radio bind:value selectedValue='hippopotamus'>Hippopotamus</Radio>
</div>

<style lang='scss'>
  .container {
    display: grid;
    grid-template-columns: auto auto;
    gap: 16px;
    max-width: 600px;
    width: fit-content;
    margin: 30vh auto;
  }
</style>
