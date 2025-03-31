export const getBlobHash = async (blob: Blob) => {
  const ab = await blob.arrayBuffer();
  const digest = await crypto.subtle.digest('SHA-256', ab);

  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};
