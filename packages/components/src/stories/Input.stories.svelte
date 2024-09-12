<script lang="ts" context="module">
  import { Story } from '@storybook/addon-svelte-csf';
  import type { Meta } from '@storybook/svelte';

  import Input from '$lib/Input.svelte';

  export const meta = {
    title: 'Input',
    component: Input,
    tags: ['autodocs'],
  } satisfies Meta<Input>;
</script>

<script lang="ts">
</script>

<Story name="Basic">
  <div class="container">
    <Input name="name" label="Label" maxBytes={50} />
  </div>
</Story>

<Story name="Text too long">
  <div class="container">
    <Input
      name="name"
      label="Label"
      maxBytes={150}
      value="The vibrant colors of the autumn leaves create a picturesque landscape that invites peaceful reflection and awe-inspiring appreciation of nature’s beauty."
    />
  </div>
</Story>

<Story name="Required">
  <div class="container">
    <Input name="name" label="Label" maxBytes={50} required />
  </div>
</Story>

<style lang="scss">
  .container {
    max-width: 400px;
  }
</style>
