// lib/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';

// Hardcoded Cloudinary configuration
cloudinary.config({
  cloud_name: 'dfw6t8scb', // Replace with your cloud name
  api_key: '733195653323131', // Replace with your API key
  api_secret: '8rq07AC7_cPR_P1Z_w5la7M6tRg', // Replace with your API secret
});

export default cloudinary;
