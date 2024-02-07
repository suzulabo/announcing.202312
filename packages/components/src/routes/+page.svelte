<script>
  import Box from '$lib/Box.svelte';
  import Button from '$lib/Button.svelte';
  import Logo from '$lib/Logo.svelte';
</script>

<Button on:click={() => {}}>ボタン</Button>
<Button --width="200px">width</Button>
<hr />
<Box>ボックス</Box>
<hr />
<Logo size="100px" />
