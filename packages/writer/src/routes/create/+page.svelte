<script lang="ts">
  import { create as formSchema } from '$lib/form/schema';
  import { t } from '$lib/i18n/translations';
  import Input from '@announcing/components/Input.svelte';
  import TextArea from '@announcing/components/TextArea.svelte';
  import { superForm } from 'sveltekit-superforms';
  import { valibotClient } from 'sveltekit-superforms/adapters';
  import type { PageData } from './$types';

  export let data: PageData;

  let validated = false;

  const { form, enhance, validateForm } = superForm(data.form, {
    validators: valibotClient(formSchema),
    validationMethod: 'oninput',
    onChange: async () => {
      const result = await validateForm();
      validated = result.valid;
    },
  });
</script>

<header>
  <div>{$t('create.title')}</div>
</header>
<div class="container">
  <form method="POST" use:enhance>
    <Input
      name="title"
      label={$t('create.input.title')}
      placeholder={$t('input.placeholder', { num: 50 })}
      maxLength={50}
      bind:value={$form.title}
    />
    <TextArea
      name="desc"
      label={$t('create.input.desc')}
      placeholder={$t('input.placeholder', { num: 500 })}
      bind:value={$form.desc}
      maxLength={500}
    />
    <button disabled={!validated}>{$t('create.input.submit')}</button>
    <a href="/">{$t('cancel')}</a>
  </form>
</div>

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
