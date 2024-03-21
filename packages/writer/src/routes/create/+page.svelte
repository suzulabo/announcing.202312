<script lang="ts">
  import { t } from '$lib/i18n/translations';
  import Input from '@announcing/components/Input.svelte';
</script>

<header>
  <div>{$t('create.title')}</div>
</header>
<div class="container">
  <Input label={$t('create.input.name')} />
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
  }
</style>
