<script lang="ts" context="module">
  export type Channel = {
    icon?: string | undefined;
    name?: string | undefined;
    desc?: string | undefined;
  };
</script>

<script lang="ts">
  import { imgSrc } from '@announcing/components/actions/imgSrc';
  import FileInput from '@announcing/components/FileInput.svelte';
  import Input from '@announcing/components/Input.svelte';
  import Loading from '@announcing/components/Loading.svelte';
  import Modal from '@announcing/components/Modal.svelte';
  import TextArea from '@announcing/components/TextArea.svelte';
  import { loadBlob } from '@announcing/components/utils/idbBlob';
  import {
    CHANNEL_DESC_MAX_BYTES,
    CHANNEL_ICON_MAX_SIZE,
    CHANNEL_NAME_MAX_BYTES,
  } from '@announcing/db/constants';
  import { LL } from '@announcing/i18n';

  let open = false;
  let loading = false;

  export let onSubmit: (formData: FormData) => Promise<void>;

  export const openEditor = (channel?: Channel) => {
    form = { ...channel };
    creating = !channel;
    open = true;
  };

  const submitClickHandler = async () => {
    const formData = new FormData();
    if (form.name) formData.append('name', form.name);
    if (form.desc) formData.append('desc', form.desc);
    if (form.icon) {
      const blob = await loadBlob(form.icon);
      if (blob) {
        formData.append('icon', blob);
      } else {
        formData.append('icon', form.icon);
      }
    }

    loading = true;
    try {
      await onSubmit(formData);
      open = false;
    } finally {
      loading = false;
    }
  };

  let creating = false;
  let form: Channel = {};
  let fileInput: FileInput;
  let nameError = false;
  let descError = false;

  $: validated = !!form.name && !nameError && !descError;
</script>

<Modal bind:open dismissMode="none">
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
            class="icon-select small"
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
    <button disabled={!validated} class="submit-btn" on:click={submitClickHandler}
      >{creating ? $LL.createChannel() : $LL.updateChannel()}</button
    >
    <button
      class="small highlight cancel-btn"
      on:click={() => {
        open = false;
      }}>{$LL.cancel()}</button
    >
  </div>
</Modal>

<Loading show={loading} />

<style lang="scss">
  .modal-body {
    background-color: var(--color-background);
    border-radius: 8px;
    width: 100%;
    max-width: 600px;
    margin: auto;
    padding: 8px 8px 16px;
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
          :global(body[locale='ja']) & {
            font-size: 12px;
            white-space: normal;
          }
        }
        button.icon-remove {
          font-size: 12px;
          padding: 4px;
          width: 64px;
          :global(body[locale='ja']) & {
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
