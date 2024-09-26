<script lang="ts" context="module">
  export type Channel = {
    icon?: string | undefined;
    name?: string | undefined;
    desc?: string | undefined;
  };
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import { imgSrc } from '$lib/actions/imgSrc';
  import FileInput from '$lib/atoms/FileInput.svelte';
  import Input from '$lib/atoms/Input.svelte';
  import Modal from '$lib/atoms/Modal.svelte';
  import TextArea from '$lib/atoms/TextArea.svelte';
  import {
    CHANNEL_DESC_MAX_BYTES,
    CHANNEL_ICON_MAX_SIZE,
    CHANNEL_NAME_MAX_BYTES,
  } from '$lib/constants';
  import LL, { locale } from '$lib/i18n/i18n-svelte';

  export let channel: Channel | undefined = undefined;

  let open = false;

  export const showModal = () => {
    form = { ...channel };
    open = true;
  };
  export const closeModal = () => {
    open = false;
  };

  const dispatcher = createEventDispatcher<{ submit: Channel }>();

  let form: Channel = {};
  let fileInput: FileInput;
  let nameError = false;
  let descError = false;

  $: validated = !!form.name && !nameError && !descError;
</script>

<Modal {open} dismissMode="none">
  <div class="modal-body">
    <div class="name-box">
      <div class="input-box">
        <Input
          name="name"
          label={$LL.channelName()}
          bind:value={form.name}
          maxBytes={CHANNEL_NAME_MAX_BYTES}
          required
          bind:error={nameError}
        />
      </div>
      <div class="icon-box">
        {#if form.icon}
          <button
            class="unstyled"
            on:click={() => {
              fileInput.open();
            }}
          >
            {#if form.icon}
              <img class="icon" alt="icon preview" use:imgSrc={form.icon} />
            {/if}
          </button>
          <button
            type="button"
            class="icon-remove"
            on:click={() => {
              form.icon = undefined;
            }}>{$LL.removeIcon()}</button
          >
        {:else}
          <button
            type="button"
            class={`icon-select small ${$locale}`}
            on:click={() => {
              fileInput.open();
            }}>{$LL.selectIcon()}</button
          >
        {/if}
        <FileInput
          accept="image/jpeg,image/png,image/webp"
          maxImageSize={CHANNEL_ICON_MAX_SIZE}
          bind:this={fileInput}
          bind:value={form.icon}
        />
      </div>
    </div>
    <TextArea
      name="desc"
      label={$LL.desc()}
      bind:value={form.desc}
      maxBytes={CHANNEL_DESC_MAX_BYTES}
      maxHeight="40vh"
      bind:error={descError}
    />
    <button
      disabled={!validated}
      class="submit-btn"
      on:click={() => {
        closeModal();
        dispatcher('submit', form);
      }}>{channel ? $LL.updateChannel() : $LL.createChannel()}</button
    >
    <button
      class="small text cancel-btn"
      on:click={() => {
        closeModal();
      }}>{$LL.cancel()}</button
    >
  </div>
</Modal>

<style lang="scss">
  .modal-body {
    background-color: var(--color-background);
    border-radius: 8px;
    width: 100%;
    max-width: 600px;
    margin: auto;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 16px;

    .name-box {
      display: flex;
      align-items: center;

      .input-box {
        flex-grow: 1;
        margin: 0 8px 0 0;
      }

      .icon-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        button.icon-select {
          width: 64px;
          height: 64px;
          &.ja {
            font-size: 12px;
          }
        }
        button.icon-remove {
          font-size: 12px;
          padding: 4px;
          width: 64px;
          &.ja {
            font-size: 11px;
          }
        }
        .icon {
          width: 64px;
          height: 64px;
          border-radius: 8px;
          object-fit: contain;
        }
      }
    }

    .submit-btn {
      align-self: center;
    }

    .cancel-btn {
      align-self: center;
    }
  }
</style>
