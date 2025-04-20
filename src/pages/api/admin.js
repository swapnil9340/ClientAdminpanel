



 import connectDB from '@/backend/config/db';
import Product from '@/backend/models/adminModal';
 connectDB();
export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const products = await Product.find(); 
      res.status(200).json(products); 
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  } else if (req.method === 'POST') {
    try {
      const product = new Product(req.body); 
      await product.save(); 
      res.status(201).json(product); 
    } catch (error) {
        console.error('Error creating product:', error); 
      res.status(500).json({ error: 'Failed to create product' });
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.query;

    try {
      const deletedProduct = await Product.findByIdAndDelete(id);
      if (!deletedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: 'Failed to delete product' });
    }
  } else if (req.method === 'PUT') {
    const { id } = req.query;
    try {
      const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!updatedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.status(200).json(updatedProduct);
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Failed to update product' });
    }
  }
   else {
    res.status(405).json({ error: 'Method Not Allowed' }); 
  }
}

