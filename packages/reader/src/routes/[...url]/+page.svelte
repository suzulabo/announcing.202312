<script lang="ts">
  import { Button } from '@announcing/components';
  import type { PageData } from './$types';
  import { t } from '$lib/translations';

  export let data: PageData;
</script>

<div class="main">
  {#if data.error}
    {#if data.error === 'RESPONSE'}
      RESPONSE ERROR
    {/if}
    {#if data.error === 'JSON'}
      JSON ERROR
    {/if}
  {/if}

  {#if data.json}
    {@const { info } = data.json}
    <div class="name-line">
      <div class="name">
        {info.name}
      </div>
      {#if info.icon}
        <img class="icon" src={info.icon} alt={info.name} />
      {/if}
    </div>
    {#if info.desc}
      <div class="desc">
        {info.desc}
      </div>
    {/if}
    {#if info.link}
      <div class="link">
        <a href={info.link} target="_blank" rel="nofollow noreferrer">{info.link}</a>
      </div>
    {/if}

    <div class="buttons">
      <Button --width="100%">{$t('follow')}</Button>
      <Button --width="100%">{$t('getNotifications')}</Button>
    </div>
  {/if}
</div>

<style lang="scss">
  .main {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px 10px;

    .name-line {
      display: flex;
      align-items: center;
      .name {
        font-weight: bold;
        font-size: 24px;
        flex-grow: 1;
      }
      .icon {
        width: 64px;
        height: 64px;
        border-radius: 8px;
        object-fit: contain;
      }
    }

    .desc {
      margin: 10px 5px 0;
      white-space: pre-line;
    }

    .link {
      margin: 10px 5px 0;
      text-decoration: underline;
    }

    .buttons {
      margin-top: 20px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
  }
</style>
