// pages/api/category.js
import { IncomingForm } from 'formidable';
import cloudinary from '@/lib/cloudinary';
import connectDB from '@/backend/config/db';
import Category from '@/backend/models/Category';

// Disable Next’s built-in body parser so Formidable can handle multipart
export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  await connectDB();
  const { method, query } = req;
  const { id } = query;

  // Helper to parse multipart/form-data
  const parseForm = () =>
    new Promise((resolve, reject) => {
      const form = new IncomingForm();
      form.parse(req, (err, fields, files) =>
        err ? reject(err) : resolve({ fields, files })
      );
    });

  try {
    if (method === 'GET') {
      if (id) {
        const cat = await Category.findById(id);
        if (!cat) return res.status(404).json({ error: 'Category not found' });
        return res.status(200).json(cat);
      }
      const all = await Category.find().sort({ createdAt: -1 });
      return res.status(200).json(all);
    }

    if (method === 'POST') {
      const { fields, files } = await parseForm();
      const name = Array.isArray(fields.name) ? fields.name[0].trim() : fields.name?.trim();

      if (!name) return res.status(400).json({ error: 'Name is required' });

      if (!files.image) {
        return res.status(400).json({ error: 'Image file is required' });
      }
      const imgFile = Array.isArray(files.image) ? files.image[0] : files.image;
      const result = await cloudinary.uploader.upload(imgFile.filepath, {
        upload_preset: 'ml_default',
      });

      const newCat = await Category.create({
        name,
        image: result.secure_url,
      });
      return res.status(201).json(newCat);
    }

    if (method === 'PUT') {
        if (!id) return res.status(400).json({ error: 'ID is required for update' });
      
        const { fields, files } = await parseForm();
        const updateData = {};
      
        const name = Array.isArray(fields.name) ? fields.name[0].trim() : fields.name?.trim();
        if (name) updateData.name = name; // ✅ add name to updateData
      
        if (files.image) {
          const imgFile = Array.isArray(files.image) ? files.image[0] : files.image;
          const result = await cloudinary.uploader.upload(imgFile.filepath, {
            upload_preset: 'ml_default',
          });
          updateData.image = result.secure_url;
        }
      
        const updated = await Category.findByIdAndUpdate(id, updateData, { new: true });
        if (!updated) return res.status(404).json({ error: 'Category not found' });
      
        return res.status(200).json(updated); // ✅ returns updated data
      }
          

    if (method === 'DELETE') {
      if (!id) return res.status(400).json({ error: 'ID is required for delete' });
      await Category.findByIdAndDelete(id);
      return res.status(200).json({ success: true });
    }

    res.setHeader('Allow', ['GET','POST','PUT','DELETE']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  } catch (err) {
    console.error('Category API Error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
