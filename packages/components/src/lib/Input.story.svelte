<script lang="ts">
  import type { Hst } from '@histoire/plugin-svelte';
  import Input from './Input.svelte';
  // eslint-disable-next-line no-import-assign
  export let Hst: Hst;

  let inputValue = '';
</script>

<Hst.Story title="Input">
  <Input
    name="name"
    label="Label"
    placeholder="Enter up to 50 characters"
    bind:value={inputValue}
    maxLength={50}
  />
</Hst.Story>
