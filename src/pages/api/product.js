import { IncomingForm } from 'formidable';
import cloudinary from '@/lib/cloudinary';
import connectDB from '@/backend/config/db';
import Product from '@/backend/models/Product';

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    const { id, modelNo, category } = req.query;

    try {
      if (id) {
        // Get by ID
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        return res.status(200).json(product);
      }

      // Build a filter object
      const filter = {};
      if (modelNo) filter.modelNo = modelNo;
      if (category) filter.category = category;

      const products = await Product.find(filter).sort({ createdAt: -1 });
      return res.status(200).json(products);
    } catch (err) {
      console.error('GET error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'Missing product ID' });
  
    try {
      const deleted = await Product.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ error: 'Product not found' });
      return res.status(200).json({ message: 'Product permanently deleted' });
    } catch (err) {
      console.error('DELETE error:', err);
      return res.status(500).json({ error: 'Failed to delete product' });
    }
  }
  

  if (req.method === 'POST') {
    // 1) Parse form-data
    let fields, files;
    try {
      ({ fields, files } = await new Promise((resolve, reject) => {
        const form = new IncomingForm({ multiples: true });
        form.parse(req, (err, flds, fls) =>
          err ? reject(err) : resolve({ fields: flds, files: fls })
        );
      }));
    } catch (err) {
      console.error('Form parse error:', err);
      return res.status(500).json({ error: 'Error parsing form data' });
    }
console.log(fields)
    // 2) Normalize & validate fields
    const nameRaw = Array.isArray(fields.name) ? fields.name[0] : fields.name;
    const modelNoRaw = Array.isArray(fields.modelNo) ? fields.modelNo[0] : fields.modelNo;
    const descriptionRaw = Array.isArray(fields.description) ? fields.description[0] : fields.description;
    const specificationRaw = Array.isArray(fields.specification) ? fields.specification[0] : fields.specification;
    const priceRaw = Array.isArray(fields.price) ? fields.price[0] : fields.price;
    const currencyRaw = Array.isArray(fields.currency) ? fields.currency[0] : fields.currency;
    const quantityRaw = Array.isArray(fields.quantity) ? fields.quantity[0] : fields.quantity;
    const sharePriceRaw = Array.isArray(fields.sharePrice) ? fields.sharePrice[0] : fields.sharePrice;
    const modeRaw = Array.isArray(fields.mode) ? fields.mode[0] : fields.mode;
    const inStockRaw = Array.isArray(fields.inStock) ? fields.inStock[0] : fields.inStock;
    const brandRaw = Array.isArray(fields.brand) ? fields.brand[0] : fields.brand;
    const categoryRaw = Array.isArray(fields.category) ? fields.category[0] : fields.category;
    const subcategoryRow = Array.isArray(fields.subcategory) ? fields.subcategory[0] : fields.subcategory;
    const metaTitleRaw = Array.isArray(fields.metaTitle) ? fields.metaTitle[0] : fields.metaTitle;
    const metaDescriptionRow = Array.isArray(fields.metaDescription) ? fields.metaDescription[0] : fields.metaDescription;
    if (!nameRaw || !modelNoRaw  || !categoryRaw) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const name = nameRaw.trim();
    const modelNo = modelNoRaw.trim();
    const description = descriptionRaw?.trim() || '';
    const specification = specificationRaw?.trim() || '';
    const price = parseFloat(priceRaw) || 0;
    const currency = currencyRaw || 'INR';
    const quantity = parseInt(quantityRaw, 10);
    const sharePrice = sharePriceRaw ? parseFloat(sharePriceRaw) : undefined;
    const mode = modeRaw?.trim();
    const inStock = inStockRaw === 'true';
    const brand = brandRaw.trim();
    const category = categoryRaw.trim();
    const subcategory =  subcategoryRow.trim()
    const metaTitle = metaTitleRaw.trim();
    const metaDescription =  metaDescriptionRow.trim()
    // 3) Handle file uploads
    const uploadedImages = [];
    const fileArray = Array.isArray(files.images) ? files.images : [files.images];
    for (const file of fileArray) {
      if (!file) continue;
      try {
        const result = await cloudinary.uploader.upload(file.filepath, {
          upload_preset: 'ml_default',
        });
        uploadedImages.push({
          url: result.secure_url,
          alt: file.originalFilename || name,
          caption: '',
        });
      } catch (uploadErr) {
        console.error('Cloudinary upload error:', uploadErr);
        return res.status(500).json({ error: 'Image upload failed' });
      }
    }

    // 4) Save to DB
    try {
      const newProduct = new Product({
        name,
        modelNo,
        description,
        specification,
        price,
        currency,
        quantity,
        sharePrice,
        mode,
        inStock,
        brand,
        category,
        subcategory,
        images: uploadedImages,
        metaTitle,
        metaDescription
      });

      await newProduct.save();
      console.log(newProduct)
      return res.status(201).json(newProduct);
    } catch (dbErr) {
      console.error('DB save error:', dbErr);
      return res.status(500).json({ error: 'Failed to create product' });
    }
  }

  if (req.method === 'PUT') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'Missing product ID' });
  
    let fields, files;
    try {
      ({ fields, files } = await new Promise((resolve, reject) => {
        const form = new IncomingForm({ multiples: true });
        form.parse(req, (err, flds, fls) =>
          err ? reject(err) : resolve({ fields: flds, files: fls })
        );
      }));
    } catch (err) {
      return res.status(500).json({ error: 'Error parsing form data' });
    }
  
    // Normalize fields
    const normalize = (f) => (Array.isArray(f) ? f[0] : f);
    const updatedFields = {
      name: normalize(fields.name),
      modelNo: normalize(fields.modelNo),
      description: normalize(fields.description),
      specification: normalize(fields.specification),
      price: parseFloat(normalize(fields.price))|| 0,
      currency: normalize(fields.currency) || 'INR',
      quantity: parseInt(normalize(fields.quantity), 10)||0,
      sharePrice: parseFloat(normalize(fields.sharePrice)) || undefined,
      mode: normalize(fields.mode),
      inStock: normalize(fields.inStock) === 'true',
      brand: normalize(fields.brand),
      category: normalize(fields.category),
    };
  
    // Fetch current product
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
  
    let currentImages = product.images || [];
  
    // Handle image deletions by index
    const deleteIndexesRaw = normalize(fields.deleteImageIndexes);
    if (deleteIndexesRaw) {
      try {
        const deleteIndexes = JSON.parse(deleteIndexesRaw);
        if (Array.isArray(deleteIndexes)) {
          currentImages = currentImages.filter((_, idx) => !deleteIndexes.includes(idx));
        }
      } catch (err) {
        console.warn('Invalid deleteImageIndexes format', err);
      }
    }
  
    // Handle new uploads
    if (files?.images) {
      const fileArray = Array.isArray(files.images) ? files.images : [files.images];
      for (const file of fileArray) {
        if (!file) continue;
        try {
          const result = await cloudinary.uploader.upload(file.filepath, {
            upload_preset: 'ml_default',
          });
          currentImages.push({
            url: result.secure_url,
            alt: file.originalFilename || updatedFields.name,
            caption: '',
          });
        } catch (uploadErr) {
          return res.status(500).json({ error: 'Image upload failed' });
        }
      }
    }
  
    // Finally update images
    updatedFields.images = currentImages;
  
    try {
      const updatedProduct = await Product.findByIdAndUpdate(id, updatedFields, { new: true });
      return res.status(200).json(updatedProduct);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to update product' });
    }
  }
  

  res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PUT']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
