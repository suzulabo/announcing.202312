<script lang="ts">
  import Modal from '$lib/atoms/Modal.svelte';
  import { LL } from '$lib/i18n';

  export let url: string;

  let open = false;
  let copied: undefined | 'copied' | 'error' = undefined;

  export const showModal = () => {
    open = true;
    copied = undefined;
  };
  export const closeModal = () => {
    open = false;
  };

  const onFocus = (event: FocusEvent) => {
    (event.target as HTMLInputElement).select();
  };
</script>

<Modal bind:open dismissMode="none">
  <div class="modal-body">
    {#if copied}
      <div
        class="msg-box"
        on:animationend={() => {
          closeModal();
        }}
      >
        {copied === 'copied' ? $LL.copied() : $LL.copyError()}
      </div>
    {:else}
      <div class="copy-box">
        <input value={url} readonly on:focus={onFocus} />
        {#if navigator.clipboard}
          <button
            on:click={() => {
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
        {/if}
      </div>
      <button
        class="close-btn text"
        on:click={() => {
          open = false;
        }}>{$LL.close()}</button
      >
    {/if}
  </div>
</Modal>

<style lang="scss">
  .modal-body {
    background-color: var(--color-background);
    border-radius: 8px;
    margin: auto;
    padding: 16px;
    width: 100%;
    max-width: 400px;

    .copy-box {
      display: flex;
      input {
        text-align: center;
      }
    }
    .msg-box {
      text-align: center;
      animation: showDelay 1s;
    }
    .close-btn {
      display: block;
      margin: 16px auto 0;
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
