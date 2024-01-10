<button class="Button"><slot /></button>

<style lang="scss">
  .Button {
    display: inline-block;
    border: 2px solid var(--color-border);
    border-radius: 10px;
    padding: 10px 20px;
    text-align: center;
    width: var(--width, 'max-content');

    :active {
      position: relative;
      top: 1px;
      left: 1px;
    }

    @media (hover: hover) {
      :hover:not(:disabled) {
        background-color: var(--color-hover);
        cursor: pointer;
      }
    }
  }
</style>
