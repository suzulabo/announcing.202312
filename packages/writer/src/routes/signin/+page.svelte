<script lang="ts">
  //import { Button } from '@announcing/components';
  import { signIn } from '@auth/sveltekit/client';
</script>

<button
  on:click={() => {
    console.log('click');
    signIn('google');
  }}>Google</button
>
