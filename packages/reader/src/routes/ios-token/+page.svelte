<script lang="ts">
  import { page } from '$app/state';
  import { getVerifyToken } from '$lib/fetch/getVerifyToken';
  import { getIOSVerifyToken, setIOSVerifyToken } from '$lib/platform/localStorage';
  import Loading from '@announcing/components/Loading.svelte';
  import { onMount } from 'svelte';

  const token = page.url.searchParams.get('token');

  let loading = $state(false);
  let status = $state<'init' | 'sent' | 'error'>('init');

  const sendToken = async () => {
    if (token) {
      try {
        const res = await getVerifyToken(token);

        const json = await res.json();
        const hash = json.hash;
        if (!hash) {
          status = 'error';
          return;
        }

        setIOSVerifyToken({ token, hash, sentTime: new Date().getTime() });

        status = 'sent';
      } catch {
        status = 'error';
      }
    }
  };

  onMount(async () => {
    const verifyToken = getIOSVerifyToken();
    if (verifyToken?.token === token) {
      status = 'sent';
    } else {
      await sendToken();
    }
  });

  const resendClick = async () => {
    loading = true;
    try {
      await sendToken();
    } finally {
      loading = false;
    }
  };
</script>

{status}
<br />
{page.url.searchParams.get('token')}

<button onclick={resendClick}>re-send</button>

<Loading show={loading} />
