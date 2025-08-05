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
  Button,
  Tooltip,
  Avatar,
  TextField
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ProductModal from './ProductModal';

const ProductGrid = () => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

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
    setCurrentProduct(item);
    setOpen(true);
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

  const filteredItems = items.filter((item) =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box p={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Typography variant="h4" fontWeight={600}>Product Inventory</Typography>

        <TextField
          label="Search Products"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setOpen(true);
            setEditMode(false);
            setCurrentProduct(null);
          }}
        >
          Add New Product
        </Button>
      </Stack>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><strong>Image</strong></TableCell>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Description</strong></TableCell>
              <TableCell><strong>Specification</strong></TableCell>
              <TableCell><strong>Category</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item._id} hover>
                <TableCell>
                  <Avatar
                    src={item.images?.[0]?.url || '/placeholder.png'}
                    alt={item.name}
                    variant="rounded"
                    sx={{ width: 50, height: 50 }}
                  />
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell sx={{
                  maxWidth: 250,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {item.description}
                </TableCell>
                <TableCell>{item.specification || "no data"}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Tooltip title="Edit">
                      <IconButton color="primary" onClick={() => handleUpdate(item)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="error" onClick={() => handleDelete(item._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {filteredItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No matching products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ProductModal
        open={open}
        onClose={() => setOpen(false)}
        editMode={editMode}
        product={currentProduct}
        refresh={fetchProducts}
      />
    </Box>
  );
};

export default ProductGrid;
