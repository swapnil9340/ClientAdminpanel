import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Avatar, IconButton, Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CategoryModal from './CategoryModal';

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [current, setCurrent] = useState(null);

  const fetch = async () => {
    const { data } = await axios.get('/api/category');
    setCategories(data);
  };

  useEffect(() => { fetch(); }, []);

  const handleEdit = cat => {
    setCurrent(cat); setEditMode(true); setOpen(true);
  };
  const handleDelete = async id => {
    if (!confirm('Delete?')) return;
    await axios.delete(`/api/category?id=${id}`);
    fetch();
  };

  return (
    <Box p={3}>
      <h1>Categories</h1>
      <Button variant="contained" onClick={() => {setEditMode(false); setCurrent(null); setOpen(true);}}>
        Add Category
      </Button>
      <TableContainer component={Paper} sx={{ mt:2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map(cat => (
              <TableRow key={cat._id}>
                <TableCell>
                  <Avatar src={cat.image} variant="rounded" />
                </TableCell>
                <TableCell>{cat.name}</TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton onClick={() => handleEdit(cat)}><EditIcon/></IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton onClick={() => handleDelete(cat._id)} color="error"><DeleteIcon/></IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {categories.length===0 && (
              <TableRow><TableCell colSpan={3} align="center">No categories</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <CategoryModal
        open={open}
        onClose={() => setOpen(false)}
        editMode={editMode}
        category={current}
        refresh={fetch}
      />
    </Box>
  );
}
