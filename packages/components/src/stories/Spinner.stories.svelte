<script lang="ts" context="module">
  import { Story } from '@storybook/addon-svelte-csf';
  import type { Meta } from '@storybook/svelte';

  import Spinner from '$lib/Spinner.svelte';

  export const meta = {
    title: 'Spinner',
    component: Spinner,
    tags: ['autodocs', 'no-snapshot'],
  } satisfies Meta<Spinner>;
</script>

<Story name="Basic">
  <Spinner />
</Story>
