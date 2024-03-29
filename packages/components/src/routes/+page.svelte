<script>
  import Input from '$lib/Input.svelte';
  import Logo from '$lib/Logo.svelte';
  import TextArea from '$lib/TextArea.svelte';

  let inputValue = '';
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
  <button disabled>disabled</button>

  <hr />
  <Logo size="100px" />

  <hr />
  <Input
    name="name"
    label="Label"
    placeholder="Enter up to 50 characters"
    bind:value={inputValue}
    maxLength={50}
  />
  <br />{inputValue}

  <hr />
  <TextArea name="name" label="Text area" placeholder="Enter up to 500 characters" maxLength={500}
  ></TextArea>

  <hr />
  <TextArea
    name="name"
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
    max-width: 800px;
  }
  hr {
    margin: 10px 0;
  }
</style>
