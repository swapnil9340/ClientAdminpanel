import mongoose from 'mongoose';

const SubCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: String, // optional image URL
}, { timestamps: true });

export default mongoose.models.SubCategory || mongoose.model('SubCategory', SubCategorySchema);
