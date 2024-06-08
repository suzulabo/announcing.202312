<script lang="ts">
  import { page } from '$app/stores';
  import { setupBack } from '$lib/actions/back';
  import { POST_BODY_MAX_LENGTH, POST_TITLE_MAX_LENGTH } from '$lib/constants';
  import { t } from '$lib/i18n/translations';
  import Input from '@announcing/components/Input.svelte';
  import Loading from '@announcing/components/Loading.svelte';
  import TextArea from '@announcing/components/TextArea.svelte';
  import SuperDebug, { numberProxy, superForm } from 'sveltekit-superforms';
  import { valibotClient } from 'sveltekit-superforms/adapters';
  import type { PageServerData } from './$types';
  import { formSchema } from './formSchema';

  export let data: PageServerData;

  let validated = false;

  const { form, enhance, validateForm, submitting, errors, isTainted } = superForm(data.form, {
    validators: valibotClient(formSchema),
    validationMethod: 'oninput',
    onChange: async () => {
      const result = await validateForm();

      console.log('valid', result.valid);
      validated = result.valid && isTainted();
    },
  });

  const updatedAtProxy = numberProxy(form, 'updatedAt');
  const back = setupBack($page.state.fromPage);

  $: cID = $page.params.cid;
  $: aID = $page.params.aid;
  $: isNew = aID === 'new';
  $: msgSuffix = isNew ? 'new' : 'edit';
</script>

<header>
  <div>{$t(`channel.announcement.write.title.${msgSuffix}`)}</div>
</header>
<div class="container">
  <form method="POST" enctype="multipart/form-data" use:enhance>
    <Input
      name="title"
      label={$t('channel.announcement.write.input.title')}
      placeholder={$t('maxLengthOptional', { num: POST_TITLE_MAX_LENGTH })}
      maxLength={POST_TITLE_MAX_LENGTH}
      bind:value={$form.title}
    />
    <TextArea
      name="body"
      label={$t('channel.announcement.write.input.body')}
      placeholder={$t('maxLength', { num: POST_BODY_MAX_LENGTH })}
      bind:value={$form.body}
      maxLength={POST_BODY_MAX_LENGTH}
    />
    <button disabled={!validated}>{$t(`channel.write.input.submit.${msgSuffix}`)}</button>
    <a href={`/c/${cID}`} use:back>{$t('cancel')}</a>
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
