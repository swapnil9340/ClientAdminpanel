const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url:     { type: String, required: true, trim: true },
  alt:     { type: String, trim: true },
  caption: { type: String, trim: true },
}, { _id: false });

const productSchema = new mongoose.Schema({
  name:        { type: String,  required: true, trim: true },
  modelNo:     { type: String,  required: true, trim: true },
  description: { type: String,  trim: true },
  specification:{type:String , trim:true}, 
  price:       { type: String,   min: 0.01 },
  currency:    { type: String,   trim: true, default: 'INR' },
  quantity:    { type: String,   min: 0 },
  sharePrice:  { type: String,  min: 0 },
  mode:        { type: String,  trim: true },
  inStock:     { type: Boolean, default: true },
  brand:       { type: String,  trim: true },
  category:    { type: String,  required: true, trim: true },
  subcategory: { type: String,  trim: true },
  images:      { type: [imageSchema], default: [] },
  metaTitle:       { type: String, trim: true },      
  metaDescription: { type: String, trim: true },      
  createdAt:   { type: Date,    default: Date.now },
  updatedAt:   { type: Date,    default: Date.now },
});

// Text and price indexes for search/filter
productSchema.index({ name: 'text', brand: 'text', category: 'text', modelNo: 'text' });
productSchema.index({ price: 1, quantity: 1 });

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
