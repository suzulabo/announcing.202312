<script lang="ts">
  import Loading from '@announcing/components/Loading.svelte';
  import SuperDebug, { numberProxy, superForm } from 'sveltekit-superforms';
  import { valibotClient } from 'sveltekit-superforms/adapters';

  import { page } from '$app/stores';
  import { setupBack } from '$lib/actions/back';
  import { t } from '$lib/i18n/translations';

  import type { PageData } from './$types';
  import { formSchema } from './formSchema';

  export let data: PageData;

  $: cid = data.cid;

  const { form, enhance, submitting, errors } = superForm(data.form, {
    validators: valibotClient(formSchema),
  });

  const updatedAtProxy = numberProxy(form, 'updatedAt');
  const back = setupBack($page.state.fromPage);
</script>

<header>
  <div>{$t(`channel.delete.title`)}</div>
</header>
<div class="container">
  <form method="POST" enctype="multipart/form-data" use:enhance>
    <div class="info">{$t(`channel.delete.desc`)}</div>
    <button>{$t(`channel.delete.input.submit`)}</button>
    <a href={`/c/${cid}`} use:back>{$t('cancel')}</a>
    <input type="hidden" name="updatedAt" value={$updatedAtProxy} />
  </form>
</div>

<Loading show={$submitting} />

<SuperDebug data={$errors.updatedAt} />

<style lang="scss">
  header {
    padding: 8px;
    text-align: center;
    border-bottom: 1px solid var(--color-border);
  }
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px 8px;
    display: flex;
    flex-direction: column;

    form {
      display: grid;
      grid-template-columns: auto;
      gap: 16px;
      * {
        margin: 0 auto;
      }
    }
  }
</style>
