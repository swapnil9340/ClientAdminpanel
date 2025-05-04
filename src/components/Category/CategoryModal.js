
import { useEffect, useRef, useState } from 'react';
import { Modal, Button, TextField } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';

export default function CategoryModal({ open, onClose, editMode, category, refresh }) {
  const { control, handleSubmit, reset, formState: { errors } } = useForm();
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (editMode && category) {
      reset({ name: category.name });
      setFile(category.image);
    } else {
      reset({ name: '' });
      setFile(null);
    }
  }, [open]);

  const onSubmit = async data => {
    const formData = new FormData();
    formData.append('name', data.name);
    if (file instanceof File) formData.append('image', file);

    if (editMode) {
      await axios.put(`/api/category/?id=${category._id}`, formData, { headers: {'Content-Type':'multipart/form-data'} });
    } else {
      await axios.post('/api/category', formData, { headers: {'Content-Type':'multipart/form-data'} });
    }
    refresh(); onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        background: '#fff', padding: 24, borderRadius: 8, width: 400
      }}>
        <h2>{editMode ? 'Edit Category' : 'Add Category'}</h2>
        <Controller
          name="name"
          control={control}
          rules={{ required: 'Name required' }}
          render={({ field }) => (
            <TextField
              {...field} label="Name" fullWidth margin="normal"
              error={!!errors.name} helperText={errors.name?.message}
            />
          )}
        />
        <input
          type="file"
          accept="image/*"
          onChange={e => setFile(e.target.files[0])}
          style={{ margin: '16px 0' }}
        />
        {file && typeof file === 'string' && (
          <img src={file} alt="cat" style={{ width: 80, height: 80, objectFit: 'cover', display: 'block', marginBottom: 16 }} />
        )}
        <Button variant="contained" color="primary" type="submit">
          {editMode ? 'Update' : 'Add'}
        </Button>
        <Button variant="text" onClick={onClose} style={{ marginLeft: 8 }}>Cancel</Button>
      </form>
    </Modal>
  );
}
