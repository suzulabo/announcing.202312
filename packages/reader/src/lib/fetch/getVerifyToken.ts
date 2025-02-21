export const getVerifyToken = async (token: string) => {
  const params = new URLSearchParams({ token });

  return await fetch(`/api/notification/verifyToken?${params.toString()}`, {
    method: 'GET',
  });
};
