<script lang="ts">
  import Modal from '$lib/atoms/Modal.svelte';
  import { LL } from '$lib/i18n';

  export let url: string;

  let modal: Modal;
  let copied: undefined | 'copied' | 'error' = undefined;

  export const showModal = () => {
    modal.showModal();
    copied = undefined;
  };
  export const closeModal = () => {
    modal.closeModal();
  };
</script>

<Modal bind:this={modal}>
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
        <input value={url} readonly />
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
      </div>
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
    }
    .msg-box {
      text-align: center;
      animation: showDelay 1s;
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
