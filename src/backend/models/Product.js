const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    trim: true,
  },
  alt: {
    type: String,
    trim: true,
  },
  caption: {
    type: String,
    trim: true,
  },
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0.01,
  },
  currency: {
    type: String,
    required: true,
    trim: true,
    default: 'INR',
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  brand: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  images: [imageSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for efficient querying
productSchema.index({ name: 'text', brand: 'text', category: 'text' });
productSchema.index({ price: 1 });

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
