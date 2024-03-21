<script>
  import Input from '$lib/Input.svelte';
  import Logo from '$lib/Logo.svelte';
</script>

<div class="main">
  <button
    on:click={() => {
      alert('click');
    }}>Button</button
  >

  <hr />
  <a class="button" href="/to">Anchor Button</a>

  <hr />
  <Logo size="100px" />

  <hr />
  <Input label="Label" />

  <hr />
  <div class="info">Information Panel</div>
</div>

<style lang="scss">
  .main {
    padding: 16px;
  }
  hr {
    margin: 10px 0;
  }
</style>
