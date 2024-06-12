export const streamToFile = async (name: string, stream?: ReadableStream) => {
  if (!stream) return;

  const blob = await new Response(stream).blob();

  return new File([blob], name);
};
