<script lang="ts">
  import type { Hst } from '@histoire/plugin-svelte';
  import { logEvent } from 'histoire/client';
  // eslint-disable-next-line no-import-assign
  export let Hst: Hst;
</script>

<Hst.Story title="button">
  <Hst.Variant title="default">
    <button
      on:click={(event) => {
        logEvent('click', event);
      }}
    >
      Click me!</button
    >
  </Hst.Variant>
  <Hst.Variant title="anchor">
    <a class="button" href="https://github.com/" target="_blank">Anchor Button</a>
  </Hst.Variant>
  <Hst.Variant title="disabled">
    <button disabled>Disabled</button>
  </Hst.Variant>
</Hst.Story>
