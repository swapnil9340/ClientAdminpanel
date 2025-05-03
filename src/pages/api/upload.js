// pages/api/upload.js
import { IncomingForm } from 'formidable';
import cloudinary from '@/lib/cloudinary';

export const config = {
  api: {
    bodyParser: false, // disable built-in parser so we can handle multipart
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 1. Parse the incoming form
  let files;
  try {
    ({ files } = await new Promise((resolve, reject) => {
      const form = new IncomingForm();
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    }));
  } catch (e) {
    console.error('Form parsing error:', e);
    return res.status(500).json({ error: 'Error parsing form data' });
  }

  // 2. Log the received files to ensure the file is actually coming through
  const file = files.image ? files.image[0] : null; // Access the first file in the array
  if (!file) {
    return res.status(400).json({ error: 'No image file received' });
  }

  // 3. Log the file path to verify it's correct
  console.log('File path:', file.filepath);

  // 4. Upload to Cloudinary
  try {
    const result = await cloudinary.uploader.upload(file.filepath, {
      upload_preset: 'ml_default', // your preset
    });

    return res.status(200).json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (uploadError) {
    console.error('Upload error:', uploadError);
    return res.status(500).json({ error: 'Upload failed' });
  }
}
