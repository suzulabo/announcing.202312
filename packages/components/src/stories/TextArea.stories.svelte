<script lang="ts" context="module">
  import { Story } from '@storybook/addon-svelte-csf';
  import type { Meta } from '@storybook/svelte';

  import TextArea from '$lib/TextArea.svelte';

  export const meta = {
    title: 'TextArea',
    component: TextArea,
    tags: ['autodocs'],
  } satisfies Meta<TextArea>;
</script>

<script lang="ts">
</script>

<Story name="Basic">
  <div class="container">
    <TextArea name="name" label="Text area" maxBytes={100}></TextArea>
  </div>
</Story>

<Story name="Long value">
  <div class="container">
    <TextArea
      name="long-value"
      label="Long value"
      maxBytes={380}
      value="In the beginning God created the heavens and the earth. Now the earth was formless and empty,
  darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.
  And God said, 'Let there be light,' and there was light. God saw that the light was good, and he
  separated the light from the darkness. God called the light 'day,' and the darkness he called
  'night."
    ></TextArea>
  </div>
</Story>

<style lang="scss">
  .container {
    max-width: 400px;
  }
</style>
