const mongoose = require('mongoose');

// Define the updated schema
const AdminDataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  brand: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  images:
    {
      url: String,
      alt: String,
      caption: String,
    }
  
});

// Use consistent model name (e.g., "AdminData")
module.exports =
  mongoose.models.AdminData || mongoose.model('AdminData', AdminDataSchema);
