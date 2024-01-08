<script lang="ts">
  import type { PageData } from './$types';

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
    <div class="info">
      {#if info.icon}
        <img class="icon" src={info.icon} alt={info.name} />
      {/if}
      <div>
        <div class="name">
          {info.name || ''}
        </div>
        <div class="desc">
          {info.desc || ''}
        </div>
        {#if info.link}
          <div class="link">
            <a href={info.link} target="_blank" rel="nofollow noreferrer">{info.link}</a>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  .main {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px 10px;

    .info {
      .icon {
        float: right;
        width: 64px;
        height: 64px;
        border-radius: 8px;
        object-fit: contain;
        margin: 0 0 0 5px;
      }
      .name {
        font-weight: bold;
        font-size: 24px;
        margin: 0 0 10px 0;
      }
      .desc {
        white-space: pre-line;
      }
      .link {
        margin: 10px 5px 0 5px;
        text-decoration: underline;
      }
    }
  }
</style>
