<script lang="ts">
  import { t } from '$lib/i18n/translations';
</script>

<div class="main">
  <a
    href="./create"
    class="button create-btn"
    on:click={() => {
      //
    }}
    >{$t('createAnnouncement')}
  </a>
</div>

<style lang="scss">
  .main {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px 10px;
    display: flex;
    flex-direction: column;

    .create-btn {
      margin: 0 auto;
    }
  }
</style>
