export function generateCloudinarySignature(callback, paramsToSign) {
  fetch(`/api/cloudinary/sign`, {
    method: 'POST',
    body: JSON.stringify({
      paramsToSign,
    }),
  })
    .then(r => r.json())
    .then(({ signature }) => {
      callback(signature);
    });
}
