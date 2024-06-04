<script lang="ts">
  import { page } from '$app/stores';
  import setupBack from '$lib/actions/back';
  import { t } from '$lib/i18n/translations';
  import Loading from '@announcing/components/Loading.svelte';
  import SuperDebug, { numberProxy, superForm } from 'sveltekit-superforms';
  import { valibotClient } from 'sveltekit-superforms/adapters';
  import type { PageServerData } from './$types';
  import formSchema from './formSchema';

  export let data: PageServerData;

  let validated = false;

  const { form, enhance, validateForm, submitting, errors, isTainted } = superForm(data.form, {
    validators: valibotClient(formSchema),
    validationMethod: 'oninput',
    onChange: async () => {
      const result = await validateForm();

      validated = result.valid && isTainted();
    },
  });

  const updatedAtProxy = numberProxy(form, 'updatedAt');
  const back = setupBack($page.state.fromPage);

  $: channelID = $page.params.id;
  $: isNew = channelID === 'new';
</script>

<header>
  <div>{$t('create.title')}</div>
</header>
<div class="container">
  <form method="POST" enctype="multipart/form-data" use:enhance>
    <button disabled={!validated}>{$t(`create.input.${isNew ? 'submit' : 'submitUpdate'}`)}</button>
    <a href={isNew ? '/' : `/c/${channelID}`} use:back>{$t('cancel')}</a>
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
