<script lang="ts">
  import { loadImage } from '@announcing/components/actions/loadImage';
  import FileInput from '@announcing/components/FileInput.svelte';
  import Input from '@announcing/components/Input.svelte';
  import Loading from '@announcing/components/Loading.svelte';
  import TextArea from '@announcing/components/TextArea.svelte';
  import { onMount } from 'svelte';
  import SuperDebug, { numberProxy, superForm } from 'sveltekit-superforms';
  import { valibotClient } from 'sveltekit-superforms/adapters';

  import { page } from '$app/stores';
  import { setupBack } from '$lib/actions/back';
  import { CHANNEL_DESC_MAX_LENGTH, CHANNEL_TITLE_MAX_LENGTH } from '$lib/constants';
  import { t } from '$lib/i18n/translations';

  import type { PageData } from './$types';
  import { formSchema } from './formSchema';

  export let data: PageData;

  let validated = false;
  let fileInput: FileInput | undefined;

  const { form, enhance, validateForm, submitting, errors, isTainted, allErrors } = superForm(
    data.form,
    {
      validators: valibotClient(formSchema),
      validationMethod: 'oninput',
    },
  );

  onMount(async () => {
    await validateForm({ update: true });
  });

  $: {
    validated = $allErrors.length === 0 && isTainted();
  }

  const updatedAtProxy = numberProxy(form, 'updatedAt');
  const back = setupBack($page.state.fromPage);

  $: cid = data.cid;
  $: isNew = cid === 'new';
  $: msgSuffix = isNew ? 'new' : 'edit';
</script>

<header>
  <div>{$t(`channel.write.title.${msgSuffix}`)}</div>
  {#if !isNew}
    <a href="./d">{$t('channel.write.delete')}</a>
  {/if}
</header>
<div class="container">
  <form method="POST" enctype="multipart/form-data" use:enhance>
    {#if $form.icon}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
      <img
        class="icon"
        alt="icon preview"
        use:loadImage={$form.icon}
        on:click={() => {
          fileInput?.open();
        }}
      />
    {/if}
    <div>
      <button
        type="button"
        on:click={() => {
          fileInput?.open();
        }}>{$t('channel.write.input.icon.select')}</button
      >
      {#if $form.icon}
        <button
          type="button"
          on:click={() => {
            $form.icon = null;
          }}>{$t('channel.write.input.icon.remove')}</button
        >
      {/if}
    </div>
    <FileInput
      name="icon"
      accept="image/jpeg,image/png,image/webp"
      maxImageSize={256}
      bind:this={fileInput}
      bind:file={$form.icon}
    />
    <Input
      name="title"
      label={$t('channel.write.input.title')}
      placeholder={$t('maxLength', { num: CHANNEL_TITLE_MAX_LENGTH })}
      maxLength={CHANNEL_TITLE_MAX_LENGTH}
      bind:value={$form.title}
    />
    <TextArea
      name="desc"
      label={$t('channel.write.input.desc')}
      placeholder={$t('maxLengthOptional', { num: CHANNEL_DESC_MAX_LENGTH })}
      bind:value={$form.desc}
      maxLength={CHANNEL_DESC_MAX_LENGTH}
    />
    <button disabled={!validated}>{$t(`channel.write.input.submit.${msgSuffix}`)}</button>
    <a href={isNew ? '/' : `/c/${cid}`} use:back>{$t('cancel')}</a>
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

      img.icon {
        width: 64px;
        height: 64px;
        border-radius: 8px;
        border: 1px solid var(--color-border);
        object-fit: contain;
        cursor: pointer;
      }
    }
  }
</style>
