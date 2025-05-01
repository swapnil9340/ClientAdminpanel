
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Stack,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useForm } from 'react-hook-form';
import { Modal, Button, Form } from 'react-bootstrap';

const ProductGrid = () => {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  const fetchProducts = () => {
    axios
      .get('/api/product')
      .then((res) => setItems(res.data))
      .catch((err) => console.error('Error fetching data:', err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleUpdate = (item) => {
    setEditMode(true);
    setCurrentProductId(item._id);
    setOpen(true);
    reset({
      name: item.name,
      description: item.description,
      price: item.price,
      currency: item.currency,
      brand: item.brand,
      category: item.category,
      inStock: item.inStock.toString(),
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/product?id=${id}`);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        inStock: data.inStock === 'true' || data.inStock === true,
      };

      if (editMode) {
        await axios.put(`/api/product?id=${currentProductId}`, payload);
      } else {
        await axios.post('/api/product', payload);
      }

      fetchProducts();
      reset();
      setOpen(false);
      setEditMode(false);
      setCurrentProductId(null);
    } catch (err) {
      console.error('Error submitting product:', err);
    }
  };

  return (
    <Box p={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Product Inventory</Typography>
        <Button variant="contained" onClick={() => {
          setOpen(true);
          setEditMode(false);
          reset();
        }}>
          Add New Product
        </Button>
      </Stack>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Description</strong></TableCell>
              <TableCell><strong>Price</strong></TableCell>
              <TableCell><strong>Currency</strong></TableCell>
              <TableCell><strong>Brand</strong></TableCell>
              <TableCell><strong>Category</strong></TableCell>
              <TableCell><strong>In Stock</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item._id} hover>
                <TableCell>{item.name}</TableCell>
                <TableCell sx={{ maxWidth: 200 }}>{item.description}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell>{item.currency}</TableCell>
                <TableCell>{item.brand}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.inStock ? 'Yes' : 'No'}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => handleUpdate(item)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(item._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for Add/Edit Product */}
      <Modal show={open} onHide={() => setOpen(false)} centered size="lg">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header closeButton>
            <Modal.Title>{editMode ? 'Edit Product' : 'Add New Product'}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="container">
              <div className="row mb-3">
                <div className="col-md-6">
                  <Form.Group controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      {...register('name', { required: true })}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group controlId="brand">
                    <Form.Label>Brand</Form.Label>
                    <Form.Control type="text" {...register('brand')} />
                  </Form.Group>
                </div>
              </div>

              <div className="mb-3">
                <Form.Group controlId="description">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    {...register('description')}
                  />
                </Form.Group>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <Form.Group controlId="price">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      type="number"
                      {...register('price', { required: true })}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group controlId="currency">
                    <Form.Label>Currency</Form.Label>
                    <Form.Control
                      type="text"
                      defaultValue="USD"
                      {...register('currency')}
                    />
                  </Form.Group>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <Form.Group controlId="category">
                    <Form.Label>Category</Form.Label>
                    <Form.Control type="text" {...register('category')} />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group controlId="inStock">
                    <Form.Label>In Stock (true/false)</Form.Label>
                    <Form.Control type="text" {...register('inStock')} />
                  </Form.Group>
                </div>
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer className="d-flex justify-content-end gap-2">
            <Button
              variant="secondary"
              onClick={() => setOpen(false)}
              className="px-4 py-2"
              style={{ fontSize: '1rem' }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="px-4 py-2"
              style={{ fontSize: '1rem' }}
            >
              {editMode ? 'Update Product' : 'Add Product'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Box>
  );
};

export default ProductGrid;
