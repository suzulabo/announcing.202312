<script lang='ts'>
  import { page } from '$app/state'
</script>

{page.url.searchParams.get('token')}
