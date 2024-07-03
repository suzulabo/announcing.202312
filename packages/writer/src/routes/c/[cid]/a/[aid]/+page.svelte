<script lang="ts">
  import { page } from '$app/stores';
  import { setupBack } from '$lib/actions/back';
  import { POST_BODY_MAX_LENGTH, POST_TITLE_MAX_LENGTH } from '$lib/constants';
  import { t } from '$lib/i18n/translations';
  import FileInput from '@announcing/components/FileInput.svelte';
  import Input from '@announcing/components/Input.svelte';
  import Loading from '@announcing/components/Loading.svelte';
  import TextArea from '@announcing/components/TextArea.svelte';
  import { loadImage } from '@announcing/components/actions/loadImage';
  import SuperDebug, { numberProxy, superForm } from 'sveltekit-superforms';
  import { valibotClient } from 'sveltekit-superforms/adapters';
  import type { PageData } from './$types';
  import { formSchema } from './formSchema';

  export let data: PageData;

  let validated = false;
  let headerImageInput: FileInput;
  let imagesInput: FileInput;

  const { form, enhance, validateForm, submitting, errors, isTainted } = superForm(data.form, {
    validators: valibotClient(formSchema),
    validationMethod: 'oninput',
    onChange: () => {
      validateForm()
        .then((result) => {
          validated = result.valid && isTainted();
        })
        .catch((err: unknown) => {
          throw err;
        });
    },
  });

  const updatedAtProxy = numberProxy(form, 'updatedAt');
  const back = setupBack($page.state.fromPage);

  $: cid = data.cid;
  $: isNew = cid === 'new';
  $: msgSuffix = isNew ? 'new' : 'edit';
</script>

<header>
  <div>{$t(`channel.announcement.write.title.${msgSuffix}`)}</div>
  {#if !isNew}
    <form method="POST" action="?/remove">
      <input type="hidden" name="updatedAt" value={$form.updatedAt} />
      <button>{$t('channel.announcement.write.input.delete')}</button>
    </form>
  {/if}
</header>
<div class="container">
  <form method="POST" action="?/write" enctype="multipart/form-data" use:enhance>
    {#if $form.headerImage}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
      <!-- svelte-ignore a11y-img-redundant-alt -->
      <img
        class="header-image"
        alt="header image preview"
        use:loadImage={$form.headerImage}
        on:click={() => {
          headerImageInput.open();
        }}
      />
    {/if}
    <div>
      <button
        type="button"
        on:click={() => {
          headerImageInput.open();
        }}>{$t('channel.announcement.write.input.headerImage.select')}</button
      >
      {#if $form.headerImage}
        <button
          type="button"
          on:click={() => {
            $form.headerImage = undefined;
          }}>{$t('channel.announcement.write.input.headerImage.remove')}</button
        >
      {/if}
    </div>
    <FileInput
      name="headerImage"
      accept="image/jpeg,image/png,image/webp"
      maxImageSize={1024}
      bind:this={headerImageInput}
      bind:file={$form.headerImage}
    />
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
    {#if $form.images}
      <div class="images">
        {#each $form.images as image}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
          <img
            alt="images preview"
            use:loadImage={image}
            on:click={() => {
              $form.images = $form.images?.filter((v) => v !== image);
            }}
          />
        {/each}
      </div>
    {/if}
    <button
      type="button"
      on:click={() => {
        imagesInput.open();
      }}>{$t('channel.announcement.write.input.images.select')}</button
    >
    <FileInput
      name="images"
      accept="image/jpeg,image/png,image/webp"
      maxImageSize={1024}
      filesCount={4}
      bind:this={imagesInput}
      bind:files={$form.images}
    />
    <button disabled={!validated}
      >{$t(`channel.announcement.write.input.submit.${msgSuffix}`)}</button
    >
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

      .header-image {
        max-width: 400px;
        max-height: 200px;
        object-fit: cover;
      }

      .images {
        display: flex;
        gap: 10px;
        img {
          max-width: 200px;
          max-height: 200px;
          object-fit: contain;
        }
      }
    }
  }
</style>
