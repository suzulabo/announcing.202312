<script>
  import Logo from '$lib/Logo.svelte';
</script>

<button
  on:click={() => {
    alert('click');
  }}>ボタン</button
>
<hr />
<Logo size="100px" />

<style lang="scss">
  hr {
    margin: 10px 0;
  }
</style>
