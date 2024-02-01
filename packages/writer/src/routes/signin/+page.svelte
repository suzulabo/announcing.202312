<script lang="ts">
  import { Button } from '@announcing/components';
  import { signIn } from '@auth/sveltekit/client';
</script>

<Button
  on:click={() => {
    signIn('google');
  }}>Google</Button
>
