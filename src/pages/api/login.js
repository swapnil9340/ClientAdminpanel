import jwt from 'jsonwebtoken';
import connectDB from '@/backend/config/db';
import Admin from '@/backend/models/Admin';

connectDB();

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send({ message: 'Only POST allowed' });

  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin || admin.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
}
