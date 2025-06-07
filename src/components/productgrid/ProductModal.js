
import { useEffect, useRef, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const ProductModal = ({ open, onClose, editMode, product, refresh }) => {
  const [images, setImages] = useState([]);
  const [formChanged, setFormChanged] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);
  const [isDataReady, setIsDataReady] = useState(false);
  const originalProduct = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm();

  const watchedValues = watch();

  // Fetch categories and subcategories when modal opens
  useEffect(() => {
    if (!open) return;

    const fetchCategories = async () => {
      try {
        const res = await axios.get('/api/category');
        const sub = await axios.get('/api/subcategory');
        setCategories(res.data || []);
        setSubCategories(sub.data || []);
        setIsDataReady(true);
      } catch (err) {
        console.error('Error fetching categories', err);
        setIsDataReady(true); // Still continue even if error
      }
    };

    fetchCategories();
  }, [open]);

  // Initialize form AFTER categories/subcategories are ready
  useEffect(() => {
    console.log(product)
    if (!open || !isDataReady) return;

    if (editMode && product) {
      const prod = {
        ...product,
        inStock: product.inStock?.toString(),
        images: product.images || [],
      };
      originalProduct.current = prod;

      reset({
        name: prod.name || '',
        modelNo: prod.modelNo || '',
        description: prod.description || '',
        specification: prod.specification || '',
        price: prod.price || '',
        currency: prod.currency || 'USD',
        quantity: prod.quantity || '',
        sharePrice: prod.sharePrice || '',
        mode: prod.mode || '',
        brand: prod.brand || '',
        category: prod.category || '',
        subcategory: prod.subcategory || '',
        inStock: prod.inStock || '',
        metaTitle: prod.metaTitle || '',
        metaDescription: prod.metaDescription || ''
      });

      setImages(prod.images);
    } else {
      reset({
        name: '',
        modelNo: '',
        description: '',
        specification:'',
        price: '',
        currency: 'USD',
        quantity: '',
        sharePrice: '',
        mode: '',
        brand: '',
        category: '',
        subcategory: '',
        inStock: '',
        metaTitle: '',
        metaDescription: ''
      });
      setImages([]);
      originalProduct.current = null;
    }
  }, [isDataReady, open]);

  // Reset data readiness when modal closes
  useEffect(() => {
    if (!open) setIsDataReady(false);
  }, [open]);

  // Track form changes
  useEffect(() => {
    if (!open || !isDataReady) return;

    const hasChanged = () => {
      if (!originalProduct.current) return true;

      const fields = [
        'name', 'modelNo', 'description','specification', 'price', 'currency',
        'quantity', 'sharePrice', 'mode', 'brand',
        'category', 'subcategory', 'inStock',
        'metaTitle', 'metaDescription'
      ];

      for (let field of fields) {
        const orig = (originalProduct.current[field] ?? '').toString().trim();
        const curr = (watchedValues[field] ?? '').toString().trim();
        if (orig !== curr) return true;
      }

      const origImgs = originalProduct.current.images || [];
      const newImg = images.some(img => img instanceof File);
      const countChanged = images.length !== origImgs.length;

      return newImg || countChanged;
    };

    setFormChanged(hasChanged());
  }, [watchedValues, images, isDataReady]);

  const handleImageChange = e => {
    setImages(prev => [...prev, ...Array.from(e.target.files)]);
  };

  const handleRemoveImage = idx => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const onSubmit = async (data) => {
    if (!formChanged) {
      onClose();
      return;
    }

    try {
      const formData = new FormData();
      formData.append('inStock', data.inStock === 'true');

      for (let key in data) {
        if (key !== 'inStock') formData.append(key, data[key]);
      }

      const newFiles = images.filter(img => img instanceof File);
      newFiles.forEach(file => {
        formData.append('images', file);
      });

      const removedIndexes = [];
      const originalImages = originalProduct.current?.images || [];

      originalImages.forEach((img, index) => {
        const stillPresent = images.some(current =>
          typeof current === 'string'
            ? current === img
            : current?.url === img?.url
        );
        if (!stillPresent) removedIndexes.push(index);
      });

      if (removedIndexes.length > 0) {
        formData.append('deleteImageIndexes', JSON.stringify(removedIndexes));
      }

      if (editMode) {
        await axios.put(`/api/product?id=${product._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axios.post('/api/product', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      refresh();
      reset();
      setImages([]);
      onClose();
    } catch (err) {
      console.error('Submission Error:', err);
    }
  };

  return (
    <Modal show={open} onHide={onClose} centered size="lg">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Update Product' : 'Add New Product'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="container">
              {/* Meta fields */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <Form.Group controlId="metaTitle">
                    <Form.Label>Meta Title</Form.Label>
                    <Form.Control
                      type="text"
                      isInvalid={!!errors.metaTitle}
                      {...register('metaTitle', {
                        required: 'Meta title is required',
                        maxLength: { value: 60, message: 'Max 60 characters' }
                      })}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.metaTitle?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group controlId="metaDescription">
                    <Form.Label>Meta Description</Form.Label>
                    <Form.Control
                      type="text"
                      isInvalid={!!errors.metaDescription}
                      {...register('metaDescription', {
                        required: 'Meta description is required',
                        maxLength: { value: 160, message: 'Max 160 characters' }
                      })}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.metaDescription?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
              </div>

              {/* Name & Model */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <Form.Group controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      isInvalid={!!errors.name}
                      {...register('name', { required: 'Name is required' })}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group controlId="modelNo">
                    <Form.Label>Model No</Form.Label>
                    <Form.Control type="text" {...register('modelNo')} />
                  </Form.Group>
                </div>
              </div>

              {/* Description */}
              <Form.Group className="mb-3" controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={3} {...register('description')} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="description">
                <Form.Label>specification</Form.Label>
                <Form.Control as="textarea" rows={3} {...register('specification')} />
              </Form.Group>
              {/* Price & Quantity & Category */}
              {/* <div className="row mb-3">
                <div className="col-md-4">
                  <Form.Group controlId="price">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      type="number"
                      isInvalid={!!errors.price}
                      {...register('price', {
                        required: 'Price is required',
                        min: { value: 0, message: 'Must be ≥ 0' }
                      })}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.price?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="col-md-4">
                  <Form.Group controlId="quantity">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                      type="number"
                      isInvalid={!!errors.quantity}
                      {...register('quantity', {
                        required: 'Quantity is required',
                        min: { value: 0, message: 'Must be ≥ 0' }
                      })}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.quantity?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="col-md-4">
                  <Form.Group controlId="currency">
                    <Form.Label>Currency</Form.Label>
                    <Form.Control type="text" {...register('currency')} defaultValue="USD" />
                  </Form.Group>
                </div>
              </div> */}

              {/* Category & Subcategory */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <Form.Group controlId="category">
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      {...register('category', { required: 'Category is required' })}
                      isInvalid={!!errors.category}
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.category?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                {/* <div className="col-md-6">
                  <Form.Group controlId="subcategory">
                    <Form.Label>Subcategory</Form.Label>
                    <Form.Select
                      {...register('subcategory', { required: 'Subcategory is required' })}
                      isInvalid={!!errors.subcategory}
                    >
                      <option value="">Select Subcategory</option>
                      {subcategories.map((sub) => (
                        <option key={sub._id} value={sub.name}>
                          {sub.name}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.subcategory?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </div> */}
              </div>

              {/* In Stock */}
              {/* <Form.Group className="mb-3" controlId="inStock">
                <Form.Label>In Stock</Form.Label>
                <Form.Control
                  type="text"
                  isInvalid={!!errors.inStock}
                  {...register('inStock', {
                    required: 'Required',
                    validate: v => ['true', 'false'].includes(v) || 'Enter true/false'
                  })}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.inStock?.message}
                </Form.Control.Feedback>
              </Form.Group> */}

              {/* Images */}
              <Form.Group controlId="images" className="mb-3">
                <Form.Label>Images</Form.Label>
                <Form.Control type="file" multiple onChange={handleImageChange} />
                <div className="mt-2 d-flex flex-wrap gap-2">
                  {images.map((img, i) => {
                    const src = img instanceof File ? URL.createObjectURL(img) : img.url;
                    return (
                      <div key={i} className="position-relative">
                        <img
                          src={src}
                          alt={`img-${i}`}
                          style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          className="position-absolute top-0 end-0"
                          onClick={() => handleRemoveImage(i)}
                        >
                          ×
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </Form.Group>
            </div>
        
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={!formChanged}
          >
            {editMode ? 'Update Product' : 'Add Product'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ProductModal;
