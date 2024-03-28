<script lang="ts">
  import { t } from '$lib/i18n/translations';
  import Input from '@announcing/components/Input.svelte';
  import TextArea from '@announcing/components/TextArea.svelte';
</script>

<header>
  <div>{$t('create.title')}</div>
</header>
<div class="container">
  <div class="form">
    <Input label={$t('create.input.title')} />
    <TextArea label={$t('create.input.desc')} />
    <button>{$t('create.input.submit')}</button>
    <a href="/">{$t('cancel')}</a>
  </div>
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

    .form {
      display: grid;
      grid-template-columns: auto;
      gap: 16px;
      * {
        margin: 0 auto;
      }
    }
  }
</style>
