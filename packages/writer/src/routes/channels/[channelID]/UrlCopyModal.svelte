<script lang="ts">
  import Modal from '@announcing/components/Modal.svelte';
  import { LL } from '@announcing/i18n';

  let open = $state(false);
  let copied: undefined | 'copied' | 'error' = $state(undefined);
  let url = $state('');

  export const openModal = (url_: string) => {
    open = true;
    url = url_;
    copied = undefined;
  };

  const onFocus = (event: FocusEvent) => {
    (event.target as HTMLInputElement).select();
  };
</script>

<Modal bind:open dismissMode="backdrop">
  <div class="modal-body">
    {#if copied}
      <div
        class="msg-box"
        onanimationend={() => {
          open = false;
        }}
      >
        {copied === 'copied' ? $LL.copied() : $LL.copyError()}
      </div>
    {:else}
      <div class="copy-box">
        <input value={url} readonly onfocus={onFocus} />
        <button
          class="small"
          onclick={() => {
            navigator.clipboard
              .writeText(url)
              .then(() => {
                copied = 'copied';
              })
              .catch(() => {
                copied = 'error';
              });
          }}>{$LL.copy()}</button
        >
      </div>
      <button
        class="close-btn filled small"
        onclick={() => {
          open = false;
        }}>{$LL.close()}</button
      >
    {/if}
  </div>
</Modal>

<style lang="scss">
  .modal-body {
    background-color: var(--color-background);
    border-radius: 16px;
    margin: auto;
    padding: 32px 16px;
    width: 100%;
    max-width: 400px;

    .copy-box {
      display: flex;
      input {
        width: auto;
        flex-grow: 1;
        text-align: center;
        border-radius: 16px 0 0 16px;
      }
      button {
        border-radius: 0 16px 16px 0;
      }
    }
    .msg-box {
      text-align: center;
      animation: showDelay 1s;
    }
    .close-btn {
      display: block;
      margin: 32px auto 0;
    }

    @keyframes showDelay {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }
  }
</style>
