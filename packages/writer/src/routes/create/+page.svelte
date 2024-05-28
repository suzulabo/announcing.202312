<script lang="ts">
  import { THREAD_DESC_MAX_LENGTH, THREAD_TITLE_MAX_LENGTH } from '$lib/constants';
  import { create as formSchema } from '$lib/form/schema';
  import { t } from '$lib/i18n/translations';
  import FileInput from '@announcing/components/FileInput.svelte';
  import Input from '@announcing/components/Input.svelte';
  import Loading from '@announcing/components/Loading.svelte';
  import TextArea from '@announcing/components/TextArea.svelte';
  import loadImage from '@announcing/components/actions/loadImage';
  import { superForm } from 'sveltekit-superforms';
  import { valibotClient } from 'sveltekit-superforms/adapters';
  import type { PageData } from './$types';

  export let data: PageData;

  let validated = false;
  let fileInput: FileInput | undefined;

  const { form, enhance, validateForm, submitting } = superForm(data.form, {
    validators: valibotClient(formSchema),
    validationMethod: 'oninput',
    onChange: async () => {
      const result = await validateForm();

      validated = result.valid;

      return;
    },
  });
</script>

<header>
  <div>{$t('create.title')}</div>
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
        on:click={() => {
          fileInput?.open();
        }}>アイコンを選択</button
      >
      {#if $form.icon}
        <button
          on:click={() => {
            $form.icon = undefined;
          }}>アイコンを削除</button
        >
      {/if}
    </div>
    <FileInput
      name="icon"
      accept="image/*"
      maxImageSize={256}
      bind:this={fileInput}
      bind:value={$form.icon}
    />
    <Input
      name="title"
      label={$t('create.input.title')}
      placeholder={$t('maxLength', { num: THREAD_TITLE_MAX_LENGTH })}
      maxLength={THREAD_TITLE_MAX_LENGTH}
      bind:value={$form.title}
    />
    <TextArea
      name="desc"
      label={$t('create.input.desc')}
      placeholder={$t('maxLengthOptional', { num: THREAD_DESC_MAX_LENGTH })}
      bind:value={$form.desc}
      maxLength={THREAD_DESC_MAX_LENGTH}
    />
    <button disabled={!validated}>{$t('create.input.submit')}</button>
    <a href="/">{$t('cancel')}</a>
  </form>
</div>

<Loading show={$submitting} />

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
