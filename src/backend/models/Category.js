import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String }, // Store Cloudinary URL or local path
}, { timestamps: true });

export default mongoose.models.Category || mongoose.model('Category', categorySchema);
