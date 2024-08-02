<script lang="ts" context="module">
  import { Story } from '@storybook/addon-svelte-csf';
  import type { Meta } from '@storybook/svelte';

  import Logo from '$lib/Logo.svelte';

  export const meta = {
    title: 'Logo',
    component: Logo,
    tags: ['autodocs'],
  } satisfies Meta<Logo>;
</script>

<Story name="Basic">
  <Logo />
</Story>
