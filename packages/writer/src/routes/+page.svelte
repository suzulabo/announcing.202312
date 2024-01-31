<script lang="ts">
  import { page } from '$app/stores';
</script>

{#if $page.data.session}
  SignedIn
{:else}
  <a href="./signin">SignIn</a>
{/if}
