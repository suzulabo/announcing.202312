<script lang="ts">
  import type { Hst } from '@histoire/plugin-svelte';
  import TextArea from './TextArea.svelte';

  // eslint-disable-next-line no-import-assign
  export let Hst: Hst;
</script>

<Hst.Story title="TextArea">
  <Hst.Variant title="default">
    <TextArea name="name" label="Text area" placeholder="Enter up to 500 characters" maxLength={500}
    ></TextArea>
  </Hst.Variant>
  <Hst.Variant title="long value">
    <TextArea
      name="name"
      label="Initial value"
      value="In the beginning God created the heavens and the earth. Now the earth was formless and empty,
  darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.
  And God said, 'Let there be light,' and there was light. God saw that the light was good, and he
  separated the light from the darkness. God called the light 'day,' and the darkness he called
  'night."
    ></TextArea>
  </Hst.Variant>
</Hst.Story>
