<script>
  import Input from '$lib/Input.svelte';
  import Logo from '$lib/Logo.svelte';
  import TextArea from '$lib/TextArea.svelte';
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
  <TextArea label="Text area"></TextArea>

  <hr />
  <TextArea
    label="Initial value"
    value="In the beginning God created the heavens and the earth. Now the earth was formless and empty,
  darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.
  And God said, 'Let there be light,' and there was light. God saw that the light was good, and he
  separated the light from the darkness. God called the light 'day,' and the darkness he called
  'night."
  ></TextArea>

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
