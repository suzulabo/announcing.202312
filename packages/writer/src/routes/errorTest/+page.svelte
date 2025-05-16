<button
  onclick={() => {
    throw new Error('Client Error Test');
  }}>Raise Error</button
>

<button
  onclick={async () => {
    await fetch('/api/channels');
    throw new Error('Client Promise Error Test');
  }}>Raise Promise Error</button
>
