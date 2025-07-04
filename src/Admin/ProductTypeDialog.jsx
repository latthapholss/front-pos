import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  DialogActions
} from '@mui/material';
import { PRODUCT_TYPE, UNIT, get } from '../Static/api';

function ProductTypeDialog({ open, onClose, onSave }) {
  const [categoryName, setCategoryName] = useState('');
  const [editingType, setEditingType] = useState(null);
  const [deletingType, setDeletingType] = useState(null);
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);

  useEffect(() => {
    handleGetCategory();
    handleGetUnit();
  
    
  }, [])
  
  const handleSaveCategory = () => {
    onSave(categoryName);
    setCategoryName('');
    onClose();
  };

  const handleChange = (e) => {
    setCategoryName(e.target.value);
  };

  const handleClose = () => {
    setCategoryName('');
    onClose();
  };
  const handleGetCategory = () =>{
    get( PRODUCT_TYPE).then(async (res) => {
      if (res.success) {
        let data = res.result
        const modifiedData = await data.map(item => {
          return {
            id: item.product_type_id,
            name: item.product_type,
            is_active: item.is_active
          };
        });
        setCategories(modifiedData);
      }
    })
  }

  const handleGetUnit =() =>{
    get( UNIT).then(async (res) => {
      if (res.success) {
        let data = res.result
        const modifiedData = await data.map(item => {
          return {
            id: item.unit_id,
            name: item.unit,
            is_active: item.is_active
          };
        });
        setUnits(modifiedData);
      }
    })
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle  sx={{color:'#696CFF'}}>เพิ่มประเภทสินค้า</DialogTitle>
      <DialogContent>
        <TextField
          label="ชื่อประเภทสินค้า"
          value={categoryName}
          onChange={handleChange}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>ยกเลิก</Button>
        <Button onClick={handleSaveCategory} variant="contained" color="primary">
          บันทึก
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProductTypeDialog;
