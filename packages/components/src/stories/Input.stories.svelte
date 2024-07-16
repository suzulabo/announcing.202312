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
    <Input name="name" label="Label" placeholder="Enter up to 50 characters" maxLength={50} />
  </div>
</Story>

<style lang="scss">
  .container {
    max-width: 400px;
  }
</style>
