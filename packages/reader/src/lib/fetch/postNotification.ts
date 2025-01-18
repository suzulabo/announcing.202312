export const postNotification = async (data: { token: string; tags: string[] }) => {
  await fetch(`/api/notification`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};
