export const uploadImageToImgbb = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
  const url = `https://api.imgbb.com/1/upload?key=${apiKey}`;

  const res = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (data.success) return data.data.display_url;
  else throw new Error('Image upload failed');
};
