import { IncomingForm } from 'formidable';
import mongoose from 'mongoose';
import cloudinary from '@/lib/cloudinary';
import connectDB from '@/backend/config/db';
import Category from '@/backend/models/Category';
import Subcategory from '@/backend/models/SubCategory'; 
// Disable Next.js's built-in body parser
export const config = { api: { bodyParser: false } };

// Helper function to parse form data
const parseForm = (req) =>
  new Promise((resolve, reject) => {
    const form = new IncomingForm();
    form.parse(req, (err, fields, files) => 
      err ? reject(err) : resolve({ fields, files })
    );
  });

  export default async function handler(req, res) {
    await connectDB();
    const { method, query } = req;
    const { id } = query;
  
    try {
      if (method === 'GET') {
        try {
          if (id) {
            const cat = await Category.findById(id)
              .populate({ path: 'subcategory', strictPopulate: false });
            if (!cat) return res.status(404).json({ error: 'Category not found' });
            return res.status(200).json(cat);
          }
  
          const all = await Category.find()
            .sort({ createdAt: -1 })
            .populate({ path: 'subcategory', strictPopulate: false });
          return res.status(200).json(all);
        } catch (error) {
          console.error('GET Category API Error:', error);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
      }
  
      if (method === 'POST') {
        const { fields, files } = await parseForm(req);
        const name = Array.isArray(fields.name) ? fields.name[0].trim() : fields.name?.trim();
        const subcategory = Array.isArray(fields.subcategory) ? fields.subcategory[0] : fields.subcategory;
  
        if (!name) return res.status(400).json({ error: 'Name is required' });
  
        const newCatData = { name };
  
        if (subcategory && mongoose.Types.ObjectId.isValid(subcategory)) {
          newCatData.subcategory = subcategory;
        }
  
        if (files?.image) {
          const imgFile = Array.isArray(files.image) ? files.image[0] : files.image;
          const result = await cloudinary.uploader.upload(imgFile.filepath, {
            upload_preset: 'ml_default',
          });
          newCatData.image = result.secure_url;
        }
  
        const newCat = await Category.create(newCatData);
        return res.status(201).json(newCat);
      }
  
      if (method === 'PUT') {
        if (!id) return res.status(400).json({ error: 'ID is required for update' });
  
        const { fields } = await parseForm(req);
        const updateData = {};
  
        const name = Array.isArray(fields.name) ? fields.name[0].trim() : fields.name?.trim();
        const subcategory = Array.isArray(fields.subcategory) ? fields.subcategory[0] : fields.subcategory;
  
        if (name) updateData.name = name;
  
        if (subcategory && mongoose.Types.ObjectId.isValid(subcategory)) {
          updateData.subcategory = subcategory;
        }
  
        console.log("Update data prepared:", updateData);
  
        const updated = await Category.findByIdAndUpdate(id, updateData, {
          new: true,
        }).populate({ path: 'subcategory', strictPopulate: false });
  
        if (!updated) return res.status(404).json({ error: 'Category not found' });
  
        return res.status(200).json(updated);
      }
  
      if (method === 'DELETE') {
        if (!id) return res.status(400).json({ error: 'ID is required for delete' });
        await Category.findByIdAndDelete(id);
        return res.status(200).json({ success: true });
      }
  
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
    } catch (err) {
      console.error('Category API Error:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
    
  