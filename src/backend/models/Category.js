// Category model
import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
  subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory' }, // Reference to subcategory model
});

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);
