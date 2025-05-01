import connectDB from '@/backend/config/db';
import Product from '@/backend/models/Product';

export default async function handler(req, res) {
  await connectDB(); // Ensure database connection

  const { method, query: { id } } = req;

  try {
    switch (method) {
      case 'GET':
        const products = await Product.find();
        return res.status(200).json(products);

      case 'POST':
        const newProduct = new Product(req.body);
        await newProduct.save();
        return res.status(201).json(newProduct);

      case 'PUT':
        if (!id) {
          return res.status(400).json({ error: 'Product ID is required for update' });
        }
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!updatedProduct) {
          return res.status(404).json({ error: 'Product not found' });
        }
        return res.status(200).json(updatedProduct);

      case 'DELETE':
        if (!id) {
          return res.status(400).json({ error: 'Product ID is required for deletion' });
        }
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
          return res.status(404).json({ error: 'Product not found' });
        }
        return res.status(200).json({ message: 'Product deleted successfully' });

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error(`Error handling ${method} request:`, error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
