export const getCloudinaryUrl = (
  img: string,
  width: number,
  height: number
) => {
  if (!img) return '/placeholder.png'; // на случай отсутствия src
  return img.replace(
    '/upload/',
    `/upload/c_pad,g_auto,b_auto,w_${width},h_${height}/f_webp/q_auto/`
  );
};
