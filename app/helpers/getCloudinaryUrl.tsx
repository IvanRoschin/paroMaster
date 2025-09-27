export const getCloudinaryUrl = (
  img: string,
  width: number,
  height: number
) => {
  return img.replace(
    '/upload/',
    `/upload/c_fill,g_auto,w_${width},h_${height}/f_webp/q_auto/`
  );
};
