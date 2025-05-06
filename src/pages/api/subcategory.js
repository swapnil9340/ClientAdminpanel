import { IncomingForm } from 'formidable';
import cloudinary from '@/lib/cloudinary';
import connectDB from '@/backend/config/db';
import SubCategory from '@/backend/models/SubCategory';

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  await connectDB();
  const { method, query } = req;
  const { id } = query;

  const parseForm = () =>
    new Promise((resolve, reject) => {
      const form = new IncomingForm();
      form.keepExtensions = true;
      form.parse(req, (err, fields, files) =>
        err ? reject(err) : resolve({ fields, files })
      );
    });

  try {
    if (method === 'GET') {
      if (id) {
        const sub = await SubCategory.findById(id);
        if (!sub) return res.status(404).json({ error: 'Subcategory not found' });
        return res.status(200).json(sub);
      }
      const all = await SubCategory.find().sort({ createdAt: -1 });
      return res.status(200).json(all);
    }

    if (method === 'POST') {
      const { fields, files } = await parseForm();
      const name = Array.isArray(fields.name) ? fields.name[0].trim() : fields.name?.trim();

      if (!name) return res.status(400).json({ error: 'Name is required' });

      let imageUrl = '';
      const imgFile = Array.isArray(files.image) ? files.image[0] : files.image;
      if (imgFile?.filepath) {
        const result = await cloudinary.uploader.upload(imgFile.filepath, {
          upload_preset: 'ml_default',
        });
        imageUrl = result.secure_url;
      }

      const newSub = await SubCategory.create({
        name,
        image: imageUrl,
      });

      return res.status(201).json(newSub);
    }

    if (method === 'PUT') {
      if (!id) return res.status(400).json({ error: 'ID is required for update' });

      const { fields, files } = await parseForm();
      const updateData = {};

      const name = Array.isArray(fields.name) ? fields.name[0].trim() : fields.name?.trim();
      if (name) updateData.name = name;

      const imgFile = Array.isArray(files.image) ? files.image[0] : files.image;
      if (imgFile?.filepath) {
        const result = await cloudinary.uploader.upload(imgFile.filepath, {
          upload_preset: 'ml_default',
        });
        updateData.image = result.secure_url;
      }

      const updated = await SubCategory.findByIdAndUpdate(id, updateData, { new: true });
      if (!updated) return res.status(404).json({ error: 'Subcategory not found' });

      return res.status(200).json(updated);
    }

    if (method === 'DELETE') {
      if (!id) return res.status(400).json({ error: 'ID is required for delete' });

      await SubCategory.findByIdAndDelete(id);
      return res.status(200).json({ success: true });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  } catch (err) {
    console.error('SubCategory API Error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
