import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

function ProductUnitDialog({ open, onClose, onSave, onUpdate, onDelete, units }) {
  const [newUnit, setNewUnit] = useState('');
  const [editingUnit, setEditingUnit] = useState(null);
  const [deletingUnit, setDeletingUnit] = useState(null);

  const handleSaveUnit = () => {
    
    onSave(newUnit);
    setNewUnit('');
    onClose();
  };

  const handleUpdateUnit = () => {
    onUpdate(editingUnit.id, newUnit);
    setNewUnit('');
    setEditingUnit(null);
    onClose();
  };

  const handleDeleteUnit = () => {
    onDelete(deletingUnit);
    setDeletingUnit(null);
    onClose();
  };

  const handleChange = (e) => {
    setNewUnit(e.target.value);
  };

  const handleEditUnit = (unit) => {
    setEditingUnit(unit);
    setNewUnit(unit.name);
    onClose();
  };

  const handleCancelEdit = () => {
    setEditingUnit(null);
    setNewUnit('');
    onClose();
  };

  const handleDeleteConfirm = (unit) => {
    setDeletingUnit(unit);
  };

  const handleCancelDelete = () => {
    setDeletingUnit(null);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ color: '#696CFF' }}>เพิ่มหน่วยสินค้า</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <InputLabel>หน่วยสินค้า</InputLabel>
          <Select
            value={editingUnit ? newUnit : ''}
            onChange={handleChange}
            input={<TextField />}
          >
            <MenuItem value="">
              <em>เลือกหน่วยสินค้า</em>
            </MenuItem>
            {units.map((unit) => (
              <MenuItem
                key={unit.id}
                value={unit.name}
                disabled={editingUnit && editingUnit.id === unit.id}
              >
                {unit.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>ยกเลิก</Button>
        <Button onClick={handleSaveUnit} variant="contained" color="primary">
          บันทึก
        </Button>
        <Button onClick={handleCancelEdit}>ยกเลิกการแก้ไข</Button>
        {editingUnit && (
          <IconButton onClick={() => handleDeleteConfirm(editingUnit)} color="secondary">
            <DeleteIcon />
          </IconButton>
        )}
        {deletingUnit && (
          <>
            <Button onClick={handleCancelDelete}>ยกเลิกการลบ</Button>
            <Button onClick={handleDeleteUnit} variant="contained" color="secondary">
              ลบ
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default ProductUnitDialog;
