// models/SubCategory.js

import mongoose from 'mongoose';

const SubCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }, // Add this line
}, { timestamps: true });

export default mongoose.models.Subcategory || mongoose.model('Subcategory', SubCategorySchema);
