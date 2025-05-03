// pages/api/products.js
import connectDB from '@/backend/config/db';
import Product from '@/backend/models/Product';

connectDB();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Fetch all products, sorted newest first
      const products = await Product.find().sort({ createdAt: -1 });
      return res.status(200).json(products);
    } catch (err) {
      console.error('GET /api/products error:', err);
      return res.status(500).json({ error: 'Failed to fetch products' });
    }
  }

  // If any other method is used
  res.setHeader('Allow', ['GET']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
